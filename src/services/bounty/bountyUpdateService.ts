
import { supabase } from '@/integrations/supabase/client';
import { BountyContribution } from '@/types/dataTypes';
import { notifyScammerBounty } from '@/services/notificationService';

// Function to add a new contribution
export const addBountyContribution = async (
  scammerId: string,
  contributorId: string,
  contributorName: string,
  amount: number,
  transactionSignature?: string,
  comment?: string,
  contributorProfilePic?: string
): Promise<BountyContribution | null> => {
  try {
    const { data, error } = await supabase
      .from('bounty_contributions')
      .insert({
        scammer_id: scammerId,
        contributor_id: contributorId,
        contributor_name: contributorName,
        contributor_profile_pic: contributorProfilePic,
        amount,
        transaction_signature: transactionSignature,
        comment,
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update total bounty amount for the scammer
    const { error: updateError } = await supabase.rpc('increment_scammer_bounty', {
      scammer_id: scammerId,
      amount_to_add: amount
    });
    
    if (updateError) throw updateError;
    
    // Get the scammer details to send a notification
    const { data: scammer } = await supabase
      .from('scammers')
      .select('name, added_by')
      .eq('id', scammerId)
      .single();
      
    if (scammer && scammer.added_by && scammer.added_by !== contributorId) {
      // Get contributor username if available
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('wallet_address', contributorId)
        .maybeSingle();
        
      const contributorUsername = profile?.username;
      
      await notifyScammerBounty(
        scammerId,
        scammer.name,
        amount,
        scammer.added_by,
        contributorId,
        contributorName,
        contributorUsername,
        contributorProfilePic
      );
    }
    
    return data;
  } catch (error) {
    console.error('Error adding bounty contribution:', error);
    return null;
  }
};

// Function to update a contribution's active status
export const updateBountyContributionStatus = async (
  contributionId: string,
  isActive: boolean
): Promise<BountyContribution | null> => {
  try {
    const { data, error } = await supabase
      .from('bounty_contributions')
      .update({ is_active })
      .eq('id', contributionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating bounty contribution status:', error);
    return null;
  }
};

// Function to delete a contribution
export const deleteBountyContribution = async (
  contributionId: string,
  scammerId: string,
  amount: number
): Promise<boolean> => {
  try {
    // Update total bounty amount for the scammer (subtract the amount)
    await supabase.rpc('decrement_scammer_bounty', {
      scammer_id: scammerId,
      amount_to_subtract: amount
    });
    
    // Delete the contribution
    const { error } = await supabase
      .from('bounty_contributions')
      .delete()
      .eq('id', contributionId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting bounty contribution:', error);
    return false;
  }
};
