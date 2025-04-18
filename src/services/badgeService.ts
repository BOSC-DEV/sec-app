
import { supabase } from '@/integrations/supabase/client';
import { MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';

export const searchEligibleRecipients = async (searchTerm: string) => {
  // Search for profiles that:
  // 1. Match the search term (username or display name)
  // 2. Do not have a badge (SEC balance below MIN_SEC_FOR_BADGE)
  // 3. Are registered users
  const { data, error } = await supabase
    .from('profiles')
    .select('wallet_address, username, display_name, profile_pic_url')
    .or(
      `username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`
    )
    .lt('sec_balance', MIN_SEC_FOR_BADGE)
    .limit(10);

  if (error) {
    console.error('Error searching for recipients:', error);
    throw error;
  }

  return data || [];
};

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

export const getDelegationInfo = async (walletAddress: string) => {
  try {
    // Get the user's profile to get delegation_limit
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('delegation_limit')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (profileError) {
      console.error('Error fetching delegation limit:', profileError);
      throw profileError;
    }
    
    // Get already delegated badges to calculate remaining
    const { data: delegatedBadges, error: badgesError } = await supabase
      .from('delegated_badges')
      .select('*')
      .eq('delegator_wallet', walletAddress)
      .eq('active', true);
    
    if (badgesError) {
      console.error('Error fetching delegated badges:', badgesError);
      throw badgesError;
    }
    
    const delegationLimit = profile?.delegation_limit || 1;
    const usedDelegations = delegatedBadges?.length || 0;
    
    console.log('Delegation info:', {
      delegationLimit,
      usedDelegations,
      walletAddress,
      activeBadges: delegatedBadges
    });
    
    return {
      delegationLimit,
      usedDelegations,
      remainingDelegations: delegationLimit - usedDelegations
    };
  } catch (error) {
    console.error('Error in getDelegationInfo:', error);
    // Return default values in case of error
    return {
      delegationLimit: 1,
      usedDelegations: 0,
      remainingDelegations: 1
    };
  }
};
