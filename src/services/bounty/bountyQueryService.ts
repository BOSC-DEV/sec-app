import { supabase, safeQuery } from "@/integrations/supabase/client";
import { BountyContribution } from "@/types/dataTypes";
import { handleError, ErrorSeverity } from "@/utils/errorHandling";
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

interface CountResult {
  count: number;
}

interface ScammerBounty {
  bounty_amount: number;
}

interface ContributionAmount {
  amount: number;
}

type SafeQueryResponse<T> = {
  data: T | null;
  error: any;
};

type QueryPromise<T> = Promise<{ data: T | null; error: any }>;

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
    const { data: countResult, error: countError } = await safeQuery<CountResult>(
      'read',
      () => supabase
        .from("bounty_contributions")
        .select("*", { count: "exact", head: true })
        .eq("scammer_id", scammerId)
        .eq("is_active", true)
        .then(result => Promise.resolve({ data: { count: result.count ?? 0 }, error: result.error })) as QueryPromise<CountResult>,
      { bypassAuth: true } // Allow public read access
    );

    if (countError) {
      console.error("Error counting bounty contributions:", countError);
      throw countError;
    }

    // Get the contributions for the current page (only get active contributions)
    const { data, error } = await safeQuery<BountyContribution[]>(
      'read',
      () => supabase
        .from("bounty_contributions")
        .select("*")
        .eq("scammer_id", scammerId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .range(from, to)
        .then(result => Promise.resolve({ data: result.data as BountyContribution[], error: result.error })) as QueryPromise<BountyContribution[]>,
      { bypassAuth: true } // Allow public read access
    );

    if (error) {
      console.error("Error fetching bounty contributions:", error);
      throw error;
    }

    const count = countResult?.count ?? 0;
    const contributions = data ?? [];
    console.log(`Found ${count} total contributions, returning ${contributions.length} for current page`);

    return {
      contributions,
      totalCount: count,
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
    
    const { data, error } = await safeQuery<BountyContribution>(
      'read',
      () => supabase
        .from("bounty_contributions")
        .select("*")
        .eq("id", contributionId)
        .maybeSingle()
        .then(result => Promise.resolve({ data: result.data as BountyContribution, error: result.error })) as QueryPromise<BountyContribution>,
      { bypassAuth: true } // Allow public read access
    );

    if (error) {
      console.error("Error fetching bounty contribution:", error);
      throw error;
    }

    return data;
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
    
    const { data, error } = await safeQuery<ScammerBounty>(
      'read',
      () => supabase
        .from("scammers")
        .select("bounty_amount")
        .eq("id", scammerId)
        .maybeSingle()
        .then(result => Promise.resolve({ data: result.data as ScammerBounty, error: result.error })) as QueryPromise<ScammerBounty>,
      { bypassAuth: true } // Allow public read access
    );

    if (error) {
      console.error("Error fetching scammer bounty amount:", error);
      throw error;
    }

    return data?.bounty_amount ?? 0;
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
): Promise<{ contributions: BountyContribution[]; totalCount: number; totalBountyAmount: number }> => {
  try {
    console.log(`Fetching bounty contributions for user ${userId}`);
    
    // Calculate pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Get total count for pagination
    const { data: countResult, error: countError } = await safeQuery<CountResult>(
      'read',
      () => supabase
        .from("bounty_contributions")
        .select("*", { count: "exact", head: true })
        .eq("contributor_id", userId)
        .eq("is_active", true)
        .then(result => Promise.resolve({ data: { count: result.count ?? 0 }, error: result.error })) as QueryPromise<CountResult>,
      { bypassAuth: false } // Require auth for user-specific data
    );

    if (countError) {
      console.error("Error counting user bounty contributions:", countError);
      throw countError;
    }

    // Get the contributions for the current page
    const { data, error } = await safeQuery<BountyContribution[]>(
      'read',
      () => supabase
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
        .range(from, to)
        .then(result => Promise.resolve({ data: result.data as BountyContribution[], error: result.error })) as QueryPromise<BountyContribution[]>,
      { bypassAuth: false } // Require auth for user-specific data
    );

    if (error) {
      console.error("Error fetching user bounty contributions:", error);
      throw error;
    }

    // Calculate total bounty amount
    const { data: allContributions, error: allContributionsError } = await safeQuery<ContributionAmount[]>(
      'read',
      () => supabase
        .from("bounty_contributions")
        .select("amount")
        .eq("contributor_id", userId)
        .eq("is_active", true)
        .then(result => Promise.resolve({ data: result.data as ContributionAmount[], error: result.error })) as QueryPromise<ContributionAmount[]>,
      { bypassAuth: false } // Require auth for user-specific data
    );

    if (allContributionsError) {
      console.error("Error fetching all user contributions:", allContributionsError);
      throw allContributionsError;
    }

    // Sum up all contributions
    const totalBountyAmount = (allContributions ?? []).reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    return {
      contributions: data ?? [],
      totalCount: countResult?.count ?? 0,
      totalBountyAmount
    };
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch user bounty contributions",
      severity: ErrorSeverity.MEDIUM,
      context: "GET_USER_BOUNTY_CONTRIBUTIONS",
    });
    return { contributions: [], totalCount: 0, totalBountyAmount: 0 };
  }
};

/**
 * Get the total contribution amount from a user for a specific scammer
 */
export const getUserContributionAmountForScammer = async (
  scammerId: string,
  userId: string
): Promise<number> => {
  try {
    const { data, error } = await safeQuery<ContributionAmount[]>(
      'read',
      () => supabase
        .from("bounty_contributions")
        .select("amount")
        .eq("scammer_id", scammerId)
        .eq("contributor_id", userId)
        .eq("is_active", true)
        .then(result => Promise.resolve({ data: result.data as ContributionAmount[], error: result.error })) as QueryPromise<ContributionAmount[]>,
      { bypassAuth: false } // Require auth for user-specific data
    );

    if (error) {
      throw error;
    }

    // Sum up all contributions
    return (data ?? []).reduce((sum, item) => sum + Number(item.amount), 0);
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch user contribution amount",
      severity: ErrorSeverity.LOW,
      context: "GET_USER_CONTRIBUTION_AMOUNT",
    });
    return 0;
  }
};
