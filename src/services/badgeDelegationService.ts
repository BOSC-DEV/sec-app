
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  const { data, error } = await supabase
    .from('delegated_badges')
    .select('*')
    .or(`delegator_wallet.eq.${walletAddress},delegated_wallet.eq.${walletAddress}`)
    .eq('active', true);

  if (error) {
    console.error('Error fetching delegated badges:', error);
    throw error;
  }

  // If we have delegations, fetch the display names and usernames for the delegator wallets
  if (data && data.length > 0) {
    try {
      // Get all delegator wallet addresses
      const delegatorWallets = data.map(d => d.delegator_wallet);
      
      // Fetch profiles for these wallets
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('wallet_address, display_name, username')
        .in('wallet_address', delegatorWallets);
      
      if (profilesError) throw profilesError;
      
      // Add display names and usernames to the delegations
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
    // First, check how many active delegations the delegator has
    const { data: existingDelegations, error: delegationError } = await supabase
      .from('delegated_badges')
      .select('*')
      .eq('delegator_wallet', delegatorWallet)
      .eq('active', true);

    if (delegationError) throw delegationError;

    // Get the delegator's profile to check their delegation limit
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

    // If we haven't reached the limit, proceed with the delegation
    const { error } = await supabase
      .from('delegated_badges')
      .insert([{
        delegator_wallet: delegatorWallet,
        delegated_wallet: delegatedWallet,
        active: true
      }]);

    if (error) throw error;

  } catch (error: any) {
    console.error('Error adding badge delegation:', error);
    throw new Error(error.message || 'Failed to add badge delegation');
  }
};

export const removeBadgeDelegation = async (delegatedWallet: string, delegatorWallet: string): Promise<void> => {
  console.log(`Removing delegation: delegated=${delegatedWallet}, delegator=${delegatorWallet}`);
  
  // Use delete operation to fully remove the delegation
  const { error, count } = await supabase
    .from('delegated_badges')
    .delete()
    .eq('delegator_wallet', delegatorWallet)
    .eq('delegated_wallet', delegatedWallet)
    .select('count');

  console.log(`Deletion result: count=${count}, error=${error ? JSON.stringify(error) : 'none'}`);

  if (error) {
    console.error('Error removing badge delegation:', error);
    throw error;
  }
  
  if (count === 0) {
    console.warn('No delegations were removed, record may not exist');
  }
};
