
import { supabase } from '@/integrations/supabase/client';
import { BountyContribution } from '@/types/dataTypes';

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
    const { data, error } = await supabase
      .from('bounty_contributions')
      .insert({
        scammer_id: contribution.scammer_id,
        amount: contribution.amount,
        comment: contribution.comment || '',
        contributor_id: contribution.contributor_id,
        contributor_name: contribution.contributor_name,
        contributor_profile_pic: contribution.contributor_profile_pic
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error adding bounty contribution:', error);
      throw error;
    }

    // Update the scammer's total bounty amount
    await supabase.rpc('increment_scammer_bounty', {
      p_scammer_id: contribution.scammer_id,
      p_amount: contribution.amount
    });

    return data as BountyContribution;
  } catch (error) {
    console.error('Error in addBountyContribution:', error);
    return null;
  }
};

export const getScammerBountyContributions = async (
  scammerId: string
): Promise<BountyContribution[]> => {
  try {
    const { data, error } = await supabase
      .from('bounty_contributions')
      .select('*')
      .eq('scammer_id', scammerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bounty contributions:', error);
      throw error;
    }

    return data as BountyContribution[];
  } catch (error) {
    console.error('Error in getScammerBountyContributions:', error);
    return [];
  }
};
