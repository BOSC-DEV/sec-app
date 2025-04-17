
import { supabase } from '@/integrations/supabase/client';

interface DelegatedBadge {
  id: string;
  delegator_wallet: string;
  delegated_wallet: string;
  created_at: string;
  active: boolean;
  display_name?: string;
}

export const getDelegatedBadges = async (walletAddress: string): Promise<DelegatedBadge[]> => {
  // Get delegations
  const { data, error } = await supabase
    .from('delegated_badges')
    .select('*')
    .or(`delegator_wallet.eq.${walletAddress},delegated_wallet.eq.${walletAddress}`)
    .eq('active', true);

  if (error) {
    console.error('Error fetching delegated badges:', error);
    throw error;
  }

  // If we have delegations, fetch the display names for the delegated wallets
  if (data && data.length > 0) {
    try {
      // Get all wallet addresses from delegations
      const walletAddresses = data.map(d => d.delegated_wallet);
      
      // Fetch profiles for these wallets
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('wallet_address, display_name')
        .in('wallet_address', walletAddresses);
      
      if (profilesError) throw profilesError;
      
      // Add display names to the delegations
      return data.map(delegation => {
        const matchingProfile = profiles?.find(p => p.wallet_address === delegation.delegated_wallet);
        return {
          ...delegation,
          display_name: matchingProfile?.display_name
        };
      });
    } catch (err) {
      console.error('Error fetching delegation display names:', err);
      // Return original data if there was an error fetching display names
      return data;
    }
  }

  return data || [];
};

export const addBadgeDelegation = async (delegatedWallet: string, delegatorWallet: string): Promise<void> => {
  const { error } = await supabase
    .from('delegated_badges')
    .insert([
      {
        delegator_wallet: delegatorWallet,
        delegated_wallet: delegatedWallet,
      }
    ]);

  if (error) {
    console.error('Error adding badge delegation:', error);
    throw error;
  }
};

export const removeBadgeDelegation = async (delegatedWallet: string, delegatorWallet: string): Promise<void> => {
  const { error } = await supabase
    .from('delegated_badges')
    .delete()
    .eq('delegator_wallet', delegatorWallet)
    .eq('delegated_wallet', delegatedWallet);

  if (error) {
    console.error('Error removing badge delegation:', error);
    throw error;
  }
};
