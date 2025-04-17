
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
  const { data, error } = await supabase
    .from('delegated_badges')
    .select('*')
    .or(`delegator_wallet.eq.${walletAddress},delegated_wallet.eq.${walletAddress}`)
    .eq('active', true);

  if (error) {
    console.error('Error fetching delegated badges:', error);
    throw error;
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
        active: true
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
