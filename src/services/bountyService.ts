
import { supabase } from '@/integrations/supabase/client';
import { BountyContribution } from '@/types/dataTypes';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
let contributionsCache: Map<string, { data: BountyContribution[], timestamp: number }> = new Map();

/**
 * Add a new bounty contribution for a scammer
 * @param contribution The contribution data
 * @returns The created contribution or null if there was an error
 */
export const addBountyContribution = async (
  contribution: {
    scammer_id: string;
    amount: number;
    comment?: string;
    contributor_id: string;
    contributor_name: string;
    contributor_profile_pic?: string;
  }
): Promise<BountyContribution | null> => {
  try {
    // Validate input data
    if (!contribution.scammer_id) throw new Error('Scammer ID is required');
    if (!contribution.contributor_id) throw new Error('Contributor ID is required');
    if (!contribution.amount || contribution.amount <= 0) throw new Error('Amount must be greater than 0');
    
    // Sanitize optional inputs
    const sanitizedComment = contribution.comment ? String(contribution.comment).trim() : null;
    
    // First get the current bounty amount
    const { data: currentBounty, error: fetchError } = await supabase
      .from('scammers')
      .select('bounty_amount')
      .eq('id', contribution.scammer_id)
      .single();

    if (fetchError) {
      handleError(fetchError, {
        fallbackMessage: 'Error fetching current bounty amount',
        severity: ErrorSeverity.MEDIUM,
        context: 'BOUNTY_FETCH'
      });
      return null;
    }

    // Calculate the new bounty amount
    const newBountyAmount = (currentBounty?.bounty_amount || 0) + contribution.amount;

    // Start a transaction using Supabase's upsert + update pattern
    // First, insert the contribution
    const { data: newContribution, error: insertError } = await supabase
      .from('bounty_contributions')
      .insert({
        scammer_id: contribution.scammer_id,
        amount: contribution.amount,
        comment: sanitizedComment,
        contributor_id: contribution.contributor_id,
        contributor_name: contribution.contributor_name,
        contributor_profile_pic: contribution.contributor_profile_pic
      })
      .select()
      .single();

    if (insertError) {
      handleError(insertError, {
        fallbackMessage: 'Error creating bounty contribution',
        severity: ErrorSeverity.MEDIUM,
        context: 'BOUNTY_CREATE'
      });
      return null;
    }

    // Then update the scammer's bounty amount
    const { error: updateError } = await supabase
      .from('scammers')
      .update({ bounty_amount: newBountyAmount })
      .eq('id', contribution.scammer_id);

    if (updateError) {
      handleError(updateError, {
        fallbackMessage: 'Error updating scammer bounty amount',
        severity: ErrorSeverity.MEDIUM,
        context: 'BOUNTY_UPDATE'
      });
      // We should handle this case better, perhaps with rollback logic
      // For now, we'll return the contribution even though the total wasn't updated
    }

    // Clear the cache for this scammer
    contributionsCache.delete(contribution.scammer_id);

    return newContribution as BountyContribution;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error processing bounty contribution',
      severity: ErrorSeverity.MEDIUM,
      context: 'BOUNTY_SERVICE'
    });
    return null;
  }
};

/**
 * Get all bounty contributions for a scammer with pagination
 * @param scammerId The ID of the scammer
 * @param page The page number (1-based)
 * @param limit The number of items per page
 * @returns An array of contributions or an empty array if there was an error
 */
export const getScammerBountyContributions = async (
  scammerId: string,
  page = 1,
  limit = 10
): Promise<{ contributions: BountyContribution[], totalCount: number }> => {
  try {
    // Validate parameters
    if (!scammerId) throw new Error('Scammer ID is required');
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100; // Set a reasonable upper limit
    
    // Check cache first
    const cacheKey = `${scammerId}-${page}-${limit}`;
    const cachedData = contributionsCache.get(scammerId);
    
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
      // Calculate pagination from cached data
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedResults = cachedData.data.slice(start, end);
      
      return {
        contributions: paginatedResults,
        totalCount: cachedData.data.length
      };
    }

    // If not in cache or cache expired, fetch from database
    // Get total count first (for pagination info)
    const { count, error: countError } = await supabase
      .from('bounty_contributions')
      .select('*', { count: 'exact', head: true })
      .eq('scammer_id', scammerId);
      
    if (countError) {
      handleError(countError, {
        fallbackMessage: 'Error counting bounty contributions',
        severity: ErrorSeverity.LOW,
        context: 'BOUNTY_COUNT'
      });
    }
    
    // Calculate pagination values
    const from = (page - 1) * limit;
    
    // Fetch the paginated data
    const { data: contributions, error } = await supabase
      .from('bounty_contributions')
      .select('*')
      .eq('scammer_id', scammerId)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (error) {
      handleError(error, {
        fallbackMessage: 'Error fetching bounty contributions',
        severity: ErrorSeverity.MEDIUM,
        context: 'BOUNTY_FETCH'
      });
      return { contributions: [], totalCount: 0 };
    }

    // If we're fetching the first page with a reasonable limit,
    // store the results in cache to potentially reduce future database calls
    if (page === 1 && limit >= 10) {
      contributionsCache.set(scammerId, {
        data: contributions as BountyContribution[],
        timestamp: Date.now()
      });
    }

    return {
      contributions: contributions as BountyContribution[],
      totalCount: count || 0
    };
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error retrieving bounty contributions',
      severity: ErrorSeverity.MEDIUM,
      context: 'BOUNTY_SERVICE'
    });
    return { contributions: [], totalCount: 0 };
  }
};

/**
 * Clear the contributions cache for testing purposes
 * or when data needs to be forcefully refreshed
 */
export const clearBountyContributionsCache = (): void => {
  contributionsCache.clear();
};
