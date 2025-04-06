
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
}): Promise<BountyContribution> => {
  try {
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
      })
      .select()
      .single();

    if (error) throw error;

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
const updateScammerBountyAmount = async (scammerId: string): Promise<void> => {
  try {
    // Calculate total bounty amount
    const { data: totalData, error: totalError } = await supabase
      .from("bounty_contributions")
      .select("amount")
      .eq("scammer_id", scammerId);

    if (totalError) throw totalError;

    const totalAmount = totalData.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    // Update the scammer with the new total
    const { error: updateError } = await supabase
      .from("scammers")
      .update({ bounty_amount: totalAmount })
      .eq("id", scammerId);

    if (updateError) throw updateError;
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
    // Calculate pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("bounty_contributions")
      .select("*", { count: "exact", head: true })
      .eq("scammer_id", scammerId);

    if (countError) throw countError;

    // Get the contributions for the current page
    const { data, error } = await supabase
      .from("bounty_contributions")
      .select("*")
      .eq("scammer_id", scammerId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

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
