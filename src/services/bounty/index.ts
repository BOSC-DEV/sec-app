
// Re-export bounty service functionality
export { 
  getBountyContribution,
  getBountyContributionsByScammerId,
  getBountyContributionsByContributorId 
} from './bountyContributionService';

export { 
  transferBounty,
  addTransferredBounty
} from './bountyTransferService';

export { 
  getTotalBounty,
  getRecentBountyContributions,
  getTopBountyContributors,
  getTopBountiedScammers
} from './bountyQueryService';

export { 
  addBountyContribution as addScammerBounty,
  updateBountyContributionStatus,
  deleteBountyContribution,
  updateScammerBounty,
  updateScammerBountyAmount
} from './bountyUpdateService';
