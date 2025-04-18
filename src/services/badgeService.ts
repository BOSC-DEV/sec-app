
import { supabase } from '@/integrations/supabase/client';

export const giftBadge = async (delegatorWallet: string, delegatedWallet: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('delegated_badges')
      .insert({
        delegator_wallet: delegatorWallet,
        delegated_wallet: delegatedWallet
      });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error gifting badge:', error);
    return { 
      success: false, 
      error: error.message.includes('limit exceeded') 
        ? error.message 
        : 'Failed to gift badge. Please try again.' 
    };
  }
};

export const getDelegatedBadges = async (walletAddress: string) => {
  const { data, error } = await supabase
    .from('delegated_badges')
    .select('*')
    .eq('delegator_wallet', walletAddress)
    .eq('active', true);

  if (error) throw error;
  return data || [];
};

export const getReceivedBadges = async (walletAddress: string) => {
  const { data, error } = await supabase
    .from('delegated_badges')
    .select('*')
    .eq('delegated_wallet', walletAddress)
    .eq('active', true);

  if (error) throw error;
  return data || [];
};
