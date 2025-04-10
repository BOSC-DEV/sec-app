
import { supabase } from "@/integrations/supabase/client";
import { BountyContribution } from "@/types/dataTypes";
import { handleError, ErrorSeverity } from "@/utils/errorHandling";

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
