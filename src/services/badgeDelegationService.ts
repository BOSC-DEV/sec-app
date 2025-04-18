import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';

interface DelegatedBadge {
  id: string;
  delegator_wallet: string;
  delegated_wallet: string;
  created_at: string;
  active: boolean;
  display_name?: string;
  delegator_username?: string;
}

export const getDelegatedBadges = async (walletAddress: string): Promise<DelegatedBadge[]> => {
  // Add cache-busting parameters to ensure fresh data
  const timestamp = new Date().getTime();
  
  const { data, error } = await supabase
    .from('delegated_badges')
    .select('*')
    .or(`delegator_wallet.eq.${walletAddress},delegated_wallet.eq.${walletAddress}`);

  if (error) {
    console.error('Error fetching delegated badges:', error);
    throw error;
  }

  // Add extra logging to debug the result
  console.log(`Fetched ${data?.length || 0} delegations for wallet ${walletAddress} at ${timestamp}`);
  
  if (data && data.length > 0) {
    try {
      const delegatorWallets = data.map(d => d.delegator_wallet);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('wallet_address, display_name, username')
        .in('wallet_address', delegatorWallets);
      
      if (profilesError) throw profilesError;
      
      return data.map(delegation => {
        const matchingProfile = profiles?.find(p => p.wallet_address === delegation.delegator_wallet);
        return {
          ...delegation,
          display_name: matchingProfile?.display_name,
          delegator_username: matchingProfile?.username
        };
      });
    } catch (err) {
      console.error('Error fetching delegation display names:', err);
      return data;
    }
  }

  return data || [];
};

export const addBadgeDelegation = async (delegatedWallet: string, delegatorWallet: string): Promise<void> => {
  try {
    const { data: existingDelegations, error: delegationError } = await supabase
      .from('delegated_badges')
      .select('*')
      .eq('delegator_wallet', delegatorWallet)
      .eq('active', true);

    if (delegationError) throw delegationError;

    const { data: delegatorProfile, error: profileError } = await supabase
      .from('profiles')
      .select('delegation_limit')
      .eq('wallet_address', delegatorWallet)
      .single();

    if (profileError) throw profileError;

    if (!delegatorProfile) {
      throw new Error('Delegator profile not found');
    }

    if (existingDelegations.length >= delegatorProfile.delegation_limit) {
      throw new Error(`You have reached your delegation limit of ${delegatorProfile.delegation_limit}`);
    }

    // Check if there was a previous delegation that's now inactive
    const { data: existingInactiveDelegation, error: inactiveCheckError } = await supabase
      .from('delegated_badges')
      .select('id')
      .eq('delegator_wallet', delegatorWallet)
      .eq('delegated_wallet', delegatedWallet)
      .eq('active', false);
      
    if (inactiveCheckError) throw inactiveCheckError;
    
    // If there's an existing inactive delegation, reactivate it instead of creating a new one
    if (existingInactiveDelegation && existingInactiveDelegation.length > 0) {
      const { error: reactivateError } = await supabase
        .from('delegated_badges')
        .update({ active: true })
        .eq('id', existingInactiveDelegation[0].id);
        
      if (reactivateError) throw reactivateError;
    } else {
      // Create a new delegation
      const { error } = await supabase
        .from('delegated_badges')
        .insert([{
          delegator_wallet: delegatorWallet,
          delegated_wallet: delegatedWallet,
          active: true
        }]);

      if (error) throw error;
    }

  } catch (error: any) {
    console.error('Error adding badge delegation:', error);
    throw new Error(error.message || 'Failed to add badge delegation');
  }
};

export const removeBadgeDelegation = async (delegatedWallet: string, delegatorWallet: string): Promise<void> => {
  try {
    console.log(`Attempting to deactivate delegation from ${delegatorWallet} to ${delegatedWallet}`);
    
    // Find the delegation to deactivate
    const { data: delegations, error: findError } = await supabase
      .from('delegated_badges')
      .select('id')
      .eq('delegator_wallet', delegatorWallet)
      .eq('delegated_wallet', delegatedWallet)
      .eq('active', true);
    
    if (findError) {
      console.error('Error finding badge delegation:', findError);
      throw findError;
    }
    
    if (!delegations || delegations.length === 0) {
      console.log('No matching active delegation found to deactivate');
      return; // No delegation found, just return
    }
    
    // Instead of deleting, update the active flag to false
    const delegationId = delegations[0].id;
    console.log(`Found delegation ID ${delegationId} to deactivate`);
    
    const { error: updateError } = await supabase
      .from('delegated_badges')
      .update({ active: false })
      .eq('id', delegationId);
    
    if (updateError) {
      console.error('Error deactivating badge delegation:', updateError);
      throw updateError;
    }
    
    console.log(`Successfully deactivated delegation with ID ${delegationId}`);
    
    // Force a refresh by calling the Supabase API again to verify update
    const { data: checkDelegation } = await supabase
      .from('delegated_badges')
      .select('*')
      .eq('id', delegationId)
      .single();
    
    if (checkDelegation && checkDelegation.active === false) {
      console.log('Verified deactivation: delegation is now inactive in database');
    } else {
      console.warn('Deactivation verification failed: delegation still appears active in database');
    }
    
  } catch (error) {
    console.error('Error in removeBadgeDelegation:', error);
    handleError(error, {
      fallbackMessage: 'Failed to remove badge delegation',
      severity: ErrorSeverity.MEDIUM,
      context: 'Badge Delegation Removal'
    });
    throw error;
  }
};
