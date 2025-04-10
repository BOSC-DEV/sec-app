
import { supabase } from "@/integrations/supabase/client";
import { handleError, ErrorSeverity } from "@/utils/errorHandling";

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
