
import { 
  getScammerBountyContributions,
  getBountyContributionById,
  getScammerTotalBounty,
  getUserBountyContributions,
  getUserContributionAmountForScammer
} from './bounty/bountyQueryService';

// Re-export functions from the query service
export {
  getScammerBountyContributions,
  getBountyContributionById,
  getScammerTotalBounty,
  getUserBountyContributions,
  getUserContributionAmountForScammer
};

// This is a convenience method to get just the total bounty amount for a user
export const getUserTotalBountyAmount = async (userId: string): Promise<number> => {
  try {
    console.log(`Getting total bounty amount for user: ${userId}`);
    const result = await getUserBountyContributions(userId, 1, 1);
    console.log(`Total bounty result:`, result);
    return result?.totalBountyAmount || 0;
  } catch (error) {
    console.error('Error in getUserTotalBountyAmount:', error);
    return 0;
  }
};
