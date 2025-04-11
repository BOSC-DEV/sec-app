
import { supabase } from "@/integrations/supabase/client";
import { BountyContribution } from "@/types/dataTypes";
import { handleError, ErrorSeverity } from "@/utils/errorHandling";
import { updateScammerBountyAmount } from './bountyUpdateService';

/**
 * Calculate the total amount already transferred from an original contribution
 */
const calculateAlreadyTransferredAmount = async (originalContributionId: string): Promise<number> => {
  try {
    // Get all transfers that originated from this contribution
    const { data, error } = await supabase
      .from("bounty_contributions")
      .select("amount")
      .eq("transferred_from_id", originalContributionId)
      .eq("is_active", true);
    
    if (error) {
      throw error;
    }
    
    // Sum up all already transferred amounts
    const totalTransferred = data ? data.reduce((sum, item) => sum + Number(item.amount), 0) : 0;
    return totalTransferred;
  } catch (error) {
    console.error("Error calculating transferred amount:", error);
    return 0; // Return 0 if there's an error to be safe
  }
};

/**
 * Transfer a bounty contribution from one scammer to another
 * Note: 10% of the original contribution must remain with the original scammer
 */
export const transferBountyContribution = async (
  originalContributionId: string,
  targetScammerId: string, 
  amount: number, 
  contributorId: string,
  contributorName: string,
  contributorProfilePic?: string
): Promise<{originalContribution: BountyContribution, newContribution: BountyContribution}> => {
  try {
    console.log(`Transferring ${amount} from contribution ${originalContributionId} to scammer ${targetScammerId}`);
    
    // Step 1: Get the original contribution
    const { data: originalContribution, error: fetchError } = await supabase
      .from("bounty_contributions")
      .select("*")
      .eq("id", originalContributionId)
      .single();
      
    if (fetchError || !originalContribution) {
      console.error("Error fetching original contribution:", fetchError);
      throw fetchError || new Error("Original contribution not found");
    }
    
    // Step 2: Check if the original contribution belongs to the contributor
    if (originalContribution.contributor_id !== contributorId) {
      throw new Error("You can only transfer your own contributions");
    }
    
    // Step 3: Check if the original contribution is active (not already transferred)
    if (originalContribution.is_active === false) {
      throw new Error("This contribution has already been transferred");
    }
    
    // Step 4: Get total amount already transferred from this contribution
    const alreadyTransferredAmount = await calculateAlreadyTransferredAmount(originalContributionId);
    console.log(`Already transferred amount: ${alreadyTransferredAmount}`);
    
    // Step 5: Calculate max transferable amount (90% of original minus already transferred)
    const maxTransferablePercent = 0.9; // 90%
    const originalMaxTransferable = originalContribution.amount * maxTransferablePercent;
    const remainingTransferable = originalMaxTransferable - alreadyTransferredAmount;
    
    if (remainingTransferable <= 0) {
      throw new Error(`You have already transferred the maximum allowed amount (90%) from this contribution`);
    }
    
    if (amount > remainingTransferable) {
      throw new Error(`You can only transfer up to ${remainingTransferable.toFixed(2)} $SEC more from this contribution`);
    }
    
    // Step 6: Calculate the remaining amount
    const remainingAmount = originalContribution.amount - alreadyTransferredAmount - amount;
    const minimumRequired = originalContribution.amount * 0.1;
    
    if (remainingAmount < minimumRequired) {
      throw new Error(`You must leave at least 10% (${minimumRequired.toFixed(2)} $SEC) of the original amount`);
    }
    
    // Step 7: Begin transaction
    // Update the original contribution
    const { data: updatedOriginal, error: updateError } = await supabase
      .from("bounty_contributions")
      .update({ 
        amount: originalContribution.amount - alreadyTransferredAmount - amount,
        is_active: true
      })
      .eq("id", originalContributionId)
      .select()
      .single();
    
    if (updateError) {
      console.error("Error updating original contribution:", updateError);
      throw updateError;
    }
    
    // Step 8: Create the new contribution with the transferred amount
    const { data: newContribution, error: insertError } = await supabase
      .from("bounty_contributions")
      .insert({
        scammer_id: targetScammerId,
        amount: amount,
        contributor_id: contributorId,
        contributor_name: contributorName,
        contributor_profile_pic: contributorProfilePic || null,
        comment: `Transferred from another scammer bounty`,
        transferred_from_id: originalContributionId,
        is_active: true
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("Error creating new contribution:", insertError);
      throw insertError;
    }
    
    // Step 9: Update the original contribution with reference to the new one
    const { error: linkError } = await supabase
      .from("bounty_contributions")
      .update({ 
        transferred_to_id: newContribution.id
      })
      .eq("id", originalContributionId);
    
    if (linkError) {
      console.error("Error linking contributions:", linkError);
      throw linkError;
    }
    
    // Step 10: Update bounty amounts for both scammers
    await updateScammerBountyAmount(originalContribution.scammer_id);
    await updateScammerBountyAmount(targetScammerId);
    
    console.log("Transfer completed successfully");
    return {
      originalContribution: updatedOriginal as BountyContribution,
      newContribution: newContribution as BountyContribution
    };
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to transfer bounty contribution",
      severity: ErrorSeverity.MEDIUM,
      context: "TRANSFER_BOUNTY_CONTRIBUTION",
    });
    throw error;
  }
};

/**
 * Get all active contributions by a user that can be transferred
 */
export const getUserTransferableContributions = async (
  userId: string,
  excludeScammerId?: string
): Promise<BountyContribution[]> => {
  try {
    console.log(`Fetching transferable contributions for user ${userId}`);
    
    let query = supabase
      .from("bounty_contributions")
      .select(`
        *,
        scammers:scammer_id (
          id,
          name,
          photo_url
        )
      `)
      .eq("contributor_id", userId)
      .eq("is_active", true);
      
    // Optionally exclude contributions to a specific scammer (when transferring to a new scammer)
    if (excludeScammerId) {
      query = query.neq("scammer_id", excludeScammerId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching transferable contributions:", error);
      throw error;
    }

    // Filter out contributions with amount too small to transfer (less than 10%)
    const transferableContributions = data.filter(
      contribution => contribution.amount > 0
    );

    return transferableContributions as BountyContribution[];
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch transferable contributions",
      severity: ErrorSeverity.MEDIUM,
      context: "GET_USER_TRANSFERABLE_CONTRIBUTIONS"
    });
    return [];
  }
};
