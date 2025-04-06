
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
 * Update the total bounty amount for a scammer
 */
export const updateScammerBountyAmount = async (scammerId: string): Promise<void> => {
  try {
    console.log(`Updating total bounty amount for scammer ${scammerId}`);
    
    // Calculate total bounty amount
    const { data: totalData, error: totalError } = await supabase
      .from("bounty_contributions")
      .select("amount")
      .eq("scammer_id", scammerId);

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

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("bounty_contributions")
      .select("*", { count: "exact", head: true })
      .eq("scammer_id", scammerId);

    if (countError) {
      console.error("Error counting bounty contributions:", countError);
      throw countError;
    }

    // Get the contributions for the current page
    const { data, error } = await supabase
      .from("bounty_contributions")
      .select("*")
      .eq("scammer_id", scammerId)
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
      .eq("contributor_id", userId);

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
