
import { supabase } from "@/integrations/supabase/client";
import { BountyContribution } from "@/types/dataTypes";
import { handleError, ErrorSeverity } from "@/utils/errorHandling";

/**
 * Add a bounty contribution for a scammer
 */
export const addBountyContribution = async (contribution: {
  scammer_id: string;
  amount: number;
  comment?: string;
  contributor_id: string;
  contributor_name: string;
  contributor_profile_pic?: string;
  transaction_signature?: string;
}): Promise<BountyContribution> => {
  try {
    console.log("Adding bounty contribution:", contribution);
    
    // First, insert the contribution
    const { data, error } = await supabase
      .from("bounty_contributions")
      .insert({
        scammer_id: contribution.scammer_id,
        amount: contribution.amount,
        comment: contribution.comment || null,
        contributor_id: contribution.contributor_id,
        contributor_name: contribution.contributor_name,
        contributor_profile_pic: contribution.contributor_profile_pic || null,
        transaction_signature: contribution.transaction_signature || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting bounty contribution:", error);
      throw error;
    }

    console.log("Bounty contribution added successfully:", data);

    // Then update the total bounty amount on the scammer
    await updateScammerBountyAmount(contribution.scammer_id);

    return data as BountyContribution;
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to add bounty contribution",
      severity: ErrorSeverity.MEDIUM,
      context: "ADD_BOUNTY_CONTRIBUTION",
    });
    throw error;
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
    
    // Step 4: Calculate transfer amount, ensuring 10% remains
    const maxTransferAmount = originalContribution.amount * 0.9;
    if (amount > maxTransferAmount) {
      throw new Error(`You can only transfer up to 90% of the original amount (${maxTransferAmount.toFixed(2)} $SEC)`);
    }
    
    // Step 5: Calculate the remaining amount
    const remainingAmount = originalContribution.amount - amount;
    if (remainingAmount < originalContribution.amount * 0.1) {
      throw new Error("You must leave at least 10% of the original amount");
    }
    
    // Step 6: Begin transaction
    // Update the original contribution
    const { data: updatedOriginal, error: updateError } = await supabase
      .from("bounty_contributions")
      .update({ 
        amount: remainingAmount,
        is_active: true
      })
      .eq("id", originalContributionId)
      .select()
      .single();
    
    if (updateError) {
      console.error("Error updating original contribution:", updateError);
      throw updateError;
    }
    
    // Step 7: Create the new contribution with the transferred amount
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
    
    // Step 8: Update the original contribution with reference to the new one
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
    
    // Step 9: Update bounty amounts for both scammers
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
 * Update the total bounty amount for a scammer
 */
export const updateScammerBountyAmount = async (scammerId: string): Promise<void> => {
  try {
    console.log(`Updating total bounty amount for scammer ${scammerId}`);
    
    // Calculate total bounty amount (only count active contributions)
    const { data: totalData, error: totalError } = await supabase
      .from("bounty_contributions")
      .select("amount")
      .eq("scammer_id", scammerId)
      .eq("is_active", true);

    if (totalError) {
      console.error("Error calculating total bounty amount:", totalError);
      throw totalError;
    }

    const totalAmount = totalData.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    console.log(`New total bounty amount: ${totalAmount}`);

    // Update the scammer with the new total
    const { error: updateError } = await supabase
      .from("scammers")
      .update({ bounty_amount: totalAmount })
      .eq("id", scammerId);

    if (updateError) {
      console.error("Error updating scammer bounty amount:", updateError);
      throw updateError;
    }
    
    console.log(`Scammer ${scammerId} bounty amount updated to ${totalAmount}`);
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to update scammer bounty amount",
      severity: ErrorSeverity.MEDIUM,
      context: "UPDATE_SCAMMER_BOUNTY",
    });
    throw error;
  }
};

/**
 * Fetch a paginated list of bounty contributions for a scammer
 */
export const getScammerBountyContributions = async (
  scammerId: string,
  page: number = 1,
  perPage: number = 5
): Promise<{ contributions: BountyContribution[]; totalCount: number }> => {
  try {
    console.log(`Fetching bounty contributions for scammer ${scammerId}, page ${page}, perPage ${perPage}`);
    
    // Calculate pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Get total count for pagination (only count active contributions)
    const { count, error: countError } = await supabase
      .from("bounty_contributions")
      .select("*", { count: "exact", head: true })
      .eq("scammer_id", scammerId)
      .eq("is_active", true);

    if (countError) {
      console.error("Error counting bounty contributions:", countError);
      throw countError;
    }

    // Get the contributions for the current page (only get active contributions)
    const { data, error } = await supabase
      .from("bounty_contributions")
      .select("*")
      .eq("scammer_id", scammerId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching bounty contributions:", error);
      throw error;
    }

    console.log(`Found ${count} total contributions, returning ${data?.length} for current page`);

    return {
      contributions: data as BountyContribution[],
      totalCount: count || 0,
    };
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch bounty contributions",
      severity: ErrorSeverity.MEDIUM,
      context: "GET_SCAMMER_BOUNTY_CONTRIBUTIONS",
    });
    // Return empty result on error
    return { contributions: [], totalCount: 0 };
  }
};

/**
 * Get a specific bounty contribution by ID
 */
export const getBountyContributionById = async (contributionId: string): Promise<BountyContribution | null> => {
  try {
    console.log(`Fetching bounty contribution with ID ${contributionId}`);
    
    const { data, error } = await supabase
      .from("bounty_contributions")
      .select("*")
      .eq("id", contributionId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching bounty contribution:", error);
      throw error;
    }

    return data as BountyContribution;
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch bounty contribution",
      severity: ErrorSeverity.MEDIUM,
      context: "GET_BOUNTY_CONTRIBUTION",
    });
    return null;
  }
};

/**
 * Get total bounty amount for a scammer
 */
export const getScammerTotalBounty = async (scammerId: string): Promise<number> => {
  try {
    console.log(`Fetching total bounty for scammer ${scammerId}`);
    
    const { data, error } = await supabase
      .from("scammers")
      .select("bounty_amount")
      .eq("id", scammerId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching scammer bounty amount:", error);
      throw error;
    }

    return data?.bounty_amount || 0;
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch scammer bounty amount",
      severity: ErrorSeverity.LOW,
      context: "GET_SCAMMER_BOUNTY",
    });
    return 0;
  }
};

/**
 * Get contributions by a specific user
 */
export const getUserBountyContributions = async (
  userId: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ contributions: BountyContribution[]; totalCount: number }> => {
  try {
    console.log(`Fetching bounty contributions for user ${userId}`);
    
    // Calculate pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("bounty_contributions")
      .select("*", { count: "exact", head: true })
      .eq("contributor_id", userId)
      .eq("is_active", true);

    if (countError) {
      console.error("Error counting user bounty contributions:", countError);
      throw countError;
    }

    // Get the contributions for the current page
    const { data, error } = await supabase
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
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching user bounty contributions:", error);
      throw error;
    }

    return {
      contributions: data as unknown as BountyContribution[],
      totalCount: count || 0,
    };
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch user bounty contributions",
      severity: ErrorSeverity.MEDIUM,
      context: "GET_USER_BOUNTY_CONTRIBUTIONS",
    });
    return { contributions: [], totalCount: 0 };
  }
};

/**
 * Get total contribution amount from a specific user for a specific scammer
 */
export const getUserContributionAmountForScammer = async (
  scammerId: string,
  userId: string
): Promise<number> => {
  try {
    console.log(`Fetching user ${userId} total contribution amount for scammer ${scammerId}`);
    
    const { data, error } = await supabase
      .from("bounty_contributions")
      .select("amount")
      .eq("scammer_id", scammerId)
      .eq("contributor_id", userId)
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching user contribution amount:", error);
      throw error;
    }

    const totalAmount = data.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    console.log(`User has contributed a total of ${totalAmount} $SEC to this scammer bounty`);
    return totalAmount;
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch user contribution amount",
      severity: ErrorSeverity.LOW,
      context: "GET_USER_CONTRIBUTION_AMOUNT"
    });
    return 0;
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
