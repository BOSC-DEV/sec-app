
// Re-export bounty service functionality
export { 
  addBountyContribution,
  getBountyContributionById 
} from './bountyContributionService';

export { 
  transferBountyContribution,
  getUserTransferableContributions
} from './bountyTransferService';

export { 
  getScammerTotalBounty,
  getScammerBountyContributions,
  getUserBountyContributions,
  getUserContributionAmountForScammer
} from './bountyQueryService';

export { 
  addBountyContribution as addScammerBounty,
  updateBountyContributionStatus,
  deleteBountyContribution,
  updateScammerBounty,
  updateScammerBountyAmount
} from './bountyUpdateService';
