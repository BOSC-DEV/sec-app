
import { 
  getScammerBountyContributions,
  getBountyContributionById,
  getScammerTotalBounty,
  getUserBountyContributions,
  getUserContributionAmountForScammer
} from './bounty/bountyQueryService';

import {
  addBountyContribution
} from './bounty/bountyContributionService';

import {
  transferBountyContribution,
  getUserTransferableContributions
} from './bounty/bountyTransferService';

// Re-export functions from bounty services
export {
  // Query service exports
  getScammerBountyContributions,
  getBountyContributionById,
  getScammerTotalBounty,
  getUserBountyContributions,
  getUserContributionAmountForScammer,
  
  // Contribution service exports
  addBountyContribution,
  
  // Transfer service exports
  transferBountyContribution,
  getUserTransferableContributions
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
