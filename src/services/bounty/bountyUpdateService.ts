
import { supabase } from '@/integrations/supabase/client';
import { BountyContribution } from '@/types/dataTypes';
import { notifyScammerBounty } from '@/services/notificationService';
import { scammerExists } from '@/services/scammerService';
import { sanitizeInput } from '@/utils/securityUtils';
import { handleError } from '@/utils/errorHandling';
import { ErrorSeverity } from '@/utils/errorSeverity';

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
    // Validate inputs
    if (!scammerId || !contributorId || !contributorName || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid bounty contribution data provided');
    }

    // Sanitize string inputs
    const sanitizedScammerId = sanitizeInput(scammerId);
    const sanitizedContributorId = sanitizeInput(contributorId);
    const sanitizedContributorName = sanitizeInput(contributorName);
    const sanitizedComment = comment ? sanitizeInput(comment) : undefined;
    const sanitizedTransactionSignature = transactionSignature ? sanitizeInput(transactionSignature) : undefined;
    const sanitizedProfilePic = contributorProfilePic ? sanitizeInput(contributorProfilePic) : undefined;
    
    // First verify the scammer exists (even if archived)
    const exists = await scammerExists(sanitizedScammerId);
    if (!exists) {
      throw new Error(`Scammer with ID ${sanitizedScammerId} does not exist`);
    }
    
    const { data, error } = await supabase
      .from('bounty_contributions')
      .insert({
        scammer_id: sanitizedScammerId,
        contributor_id: sanitizedContributorId,
        contributor_name: sanitizedContributorName,
        contributor_profile_pic: sanitizedProfilePic,
        amount,
        transaction_signature: sanitizedTransactionSignature,
        comment: sanitizedComment,
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update total bounty amount for the scammer
    await updateScammerBounty(sanitizedScammerId, amount, true);
    
    // Get the scammer details to send a notification
    const { data: scammer } = await supabase
      .from('scammers')
      .select('name, added_by')
      .eq('id', sanitizedScammerId)
      .single();
      
    if (scammer && scammer.added_by && scammer.added_by !== sanitizedContributorId) {
      // Get contributor username if available
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', sanitizedContributorId)
        .maybeSingle();
        
      const contributorUsername = profile?.username;
      
      await notifyScammerBounty(
        sanitizedScammerId,
        scammer.name,
        amount,
        scammer.added_by,
        sanitizedContributorId,
        sanitizedContributorName,
        contributorUsername,
        sanitizedProfilePic
      );
    }
    
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to add bounty contribution',
      severity: ErrorSeverity.MEDIUM,
      context: 'addBountyContribution'
    });
    return null;
  }
};

// Function to update a contribution's active status
export const updateBountyContributionStatus = async (
  contributionId: string,
  isActive: boolean
): Promise<BountyContribution | null> => {
  try {
    if (!contributionId) {
      throw new Error('Invalid contribution ID provided');
    }
    
    const sanitizedContributionId = sanitizeInput(contributionId);
    
    const { data, error } = await supabase
      .from('bounty_contributions')
      .update({ is_active: isActive })
      .eq('id', sanitizedContributionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update bounty contribution status',
      severity: ErrorSeverity.MEDIUM,
      context: 'updateBountyContributionStatus'
    });
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
    if (!contributionId || !scammerId || isNaN(amount)) {
      throw new Error('Invalid data for deleting bounty contribution');
    }
    
    const sanitizedContributionId = sanitizeInput(contributionId);
    const sanitizedScammerId = sanitizeInput(scammerId);
    
    // Update total bounty amount for the scammer (subtract the amount)
    await updateScammerBounty(sanitizedScammerId, amount, false);
    
    // Delete the contribution
    const { error } = await supabase
      .from('bounty_contributions')
      .delete()
      .eq('id', sanitizedContributionId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to delete bounty contribution',
      severity: ErrorSeverity.MEDIUM,
      context: 'deleteBountyContribution'
    });
    return false;
  }
};

// Helper function to update scammer bounty amount
export const updateScammerBounty = async (
  scammerId: string,
  amount: number,
  isAddition: boolean
): Promise<boolean> => {
  try {
    if (!scammerId || isNaN(amount)) {
      throw new Error('Invalid data for updating scammer bounty');
    }
    
    const sanitizedScammerId = sanitizeInput(scammerId);
    
    // First verify the scammer exists (even if archived)
    const exists = await scammerExists(sanitizedScammerId);
    if (!exists) {
      throw new Error(`Scammer with ID ${sanitizedScammerId} does not exist`);
    }
    
    // Instead of using RPC functions that don't exist, use direct update
    const { data: scammer } = await supabase
      .from('scammers')
      .select('bounty_amount')
      .eq('id', sanitizedScammerId)
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
      .eq('id', sanitizedScammerId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, {
      fallbackMessage: `Failed to ${isAddition ? 'increment' : 'decrement'} scammer bounty`,
      severity: ErrorSeverity.MEDIUM,
      context: 'updateScammerBounty'
    });
    return false;
  }
};

// Adding a function with the alternative name to fix the import errors
export const updateScammerBountyAmount = async (scammerId: string): Promise<boolean> => {
  try {
    if (!scammerId) {
      throw new Error('Invalid scammer ID provided');
    }
    
    const sanitizedScammerId = sanitizeInput(scammerId);
    
    // First verify the scammer exists (even if archived)
    const exists = await scammerExists(sanitizedScammerId);
    if (!exists) {
      throw new Error(`Scammer with ID ${sanitizedScammerId} does not exist`);
    }
    
    // Calculate the total bounty amount from all active contributions
    const { data, error } = await supabase
      .from('bounty_contributions')
      .select('amount')
      .eq('scammer_id', sanitizedScammerId)
      .eq('is_active', true);
      
    if (error) throw error;
    
    const totalAmount = data.reduce((sum, contribution) => sum + Number(contribution.amount), 0);
    
    // Update the scammer's bounty_amount field
    const { error: updateError } = await supabase
      .from('scammers')
      .update({ bounty_amount: totalAmount })
      .eq('id', sanitizedScammerId);
      
    if (updateError) throw updateError;
    return true;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update scammer bounty amount',
      severity: ErrorSeverity.MEDIUM,
      context: 'updateScammerBountyAmount'
    });
    return false;
  }
};
