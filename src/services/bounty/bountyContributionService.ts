
import { supabase } from "@/integrations/supabase/client";
import { BountyContribution } from "@/types/dataTypes";
import { handleError, ErrorSeverity } from "@/utils/errorHandling";
import { updateScammerBountyAmount } from './bountyUpdateService';

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
