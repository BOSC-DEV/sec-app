
import { supabase } from '@/integrations/supabase/client';
import { BountyContribution } from '@/types/dataTypes';

// The current database doesn't have a bounty_contributions table
// This is a mock implementation until the table is created
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
    // Simulate adding a bounty contribution
    const mockContribution: BountyContribution = {
      id: `contribution-${Date.now()}`,
      scammer_id: contribution.scammer_id,
      amount: contribution.amount,
      comment: contribution.comment || '',
      contributor_id: contribution.contributor_id,
      contributor_name: contribution.contributor_name,
      contributor_profile_pic: contribution.contributor_profile_pic,
      created_at: new Date().toISOString()
    };

    // First get the current bounty amount
    const { data: currentBounty, error: fetchError } = await supabase
      .from('scammers')
      .select('bounty_amount')
      .eq('id', contribution.scammer_id)
      .single();

    if (fetchError) {
      console.error('Error fetching current bounty amount:', fetchError);
      throw fetchError;
    }

    // Calculate the new bounty amount
    const newBountyAmount = (currentBounty?.bounty_amount || 0) + contribution.amount;

    // Then update the scammer's bounty amount
    const { error } = await supabase
      .from('scammers')
      .update({ bounty_amount: newBountyAmount })
      .eq('id', contribution.scammer_id);

    if (error) {
      console.error('Error updating scammer bounty:', error);
      throw error;
    }

    return mockContribution;
  } catch (error) {
    console.error('Error in addBountyContribution:', error);
    return null;
  }
};

export const getScammerBountyContributions = async (
  scammerId: string
): Promise<BountyContribution[]> => {
  try {
    // Since there's no table yet, return mock data
    const mockContributions: BountyContribution[] = [
      {
        id: 'contribution-1',
        scammer_id: scammerId,
        amount: 50,
        comment: 'Hope they catch this person soon!',
        contributor_id: 'wallet-123',
        contributor_name: 'CryptoHunter',
        contributor_profile_pic: '/placeholder.svg',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        id: 'contribution-2',
        scammer_id: scammerId,
        amount: 25,
        comment: 'Adding to the bounty to help with the investigation',
        contributor_id: 'wallet-456',
        contributor_name: 'BlockchainWatcher',
        contributor_profile_pic: '/placeholder.svg',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      }
    ];

    return mockContributions;
  } catch (error) {
    console.error('Error in getScammerBountyContributions:', error);
    return [];
  }
};
