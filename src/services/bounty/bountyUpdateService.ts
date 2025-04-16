
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
    await updateScammerBounty(scammerId, amount, true);
    
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
      .update({ is_active: isActive })
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
    await updateScammerBounty(scammerId, amount, false);
    
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

// Helper function to update scammer bounty amount
// This function works for both active and archived scammers
export const updateScammerBounty = async (
  scammerId: string,
  amount: number,
  isAddition: boolean
): Promise<boolean> => {
  try {
    // Get current bounty amount regardless of deleted_at status
    const { data: scammer } = await supabase
      .from('scammers')
      .select('bounty_amount')
      .eq('id', scammerId)
      .single();
      
    if (!scammer) {
      throw new Error('Scammer not found');
    }
    
    const currentAmount = scammer.bounty_amount || 0;
    const newAmount = isAddition 
      ? currentAmount + amount 
      : Math.max(currentAmount - amount, 0);
      
    const { error } = await supabase
      .from('scammers')
      .update({ bounty_amount: newAmount })
      .eq('id', scammerId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error ${isAddition ? 'incrementing' : 'decrementing'} scammer bounty:`, error);
    return false;
  }
};

// Adding a function with the alternative name to fix the import errors
// This also works with archived scammers
export const updateScammerBountyAmount = async (scammerId: string): Promise<boolean> => {
  try {
    // Calculate the total bounty amount from all active contributions
    // regardless of whether the scammer is archived or not
    const { data, error } = await supabase
      .from('bounty_contributions')
      .select('amount')
      .eq('scammer_id', scammerId)
      .eq('is_active', true);
      
    if (error) throw error;
    
    const totalAmount = data.reduce((sum, contribution) => sum + Number(contribution.amount), 0);
    
    // Update the scammer's bounty_amount field
    const { error: updateError } = await supabase
      .from('scammers')
      .update({ bounty_amount: totalAmount })
      .eq('id', scammerId);
      
    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error updating scammer bounty amount:', error);
    return false;
  }
};
