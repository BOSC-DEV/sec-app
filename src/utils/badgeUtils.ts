
// Define the badge tier enum
export enum BadgeTier {
  SHRIMP = 'SHRIMP',
  BULL = 'BULL',
  LION = 'LION',
  KING_COBRA = 'KING_COBRA',
  BULL_SHARK = 'BULL_SHARK',
  GREAT_APE = 'GREAT_APE',
  GOLDEN_EAGLE = 'GOLDEN_EAGLE',
  TREX = 'TREX',
  BLUE_WHALE = 'BLUE_WHALE'
}

// Define total SEC supply constant
export const TOTAL_SEC_SUPPLY = 1_000_000_000;

// Define badge info interface
export interface BadgeInfo {
  tier: BadgeTier;
  color: string;
  icon: string;
  minHolding: number;
  percentOfSupply: number;
  nextTier?: {
    name: BadgeTier;
    minHolding: number;
    remaining: number;
  };
}

// Define badge tiers with their properties
export const BADGE_TIERS: { [key in BadgeTier]: { minPercent: number, color: string, icon: string } } = {
  [BadgeTier.SHRIMP]: { minPercent: 0, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦐' },
  [BadgeTier.BULL]: { minPercent: 0.01, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🐂' },
  [BadgeTier.LION]: { minPercent: 0.03, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦁' },
  [BadgeTier.KING_COBRA]: { minPercent: 0.06, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🐍' },
  [BadgeTier.BULL_SHARK]: { minPercent: 0.1, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦈' },
  [BadgeTier.GREAT_APE]: { minPercent: 0.3, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦍' },
  [BadgeTier.GOLDEN_EAGLE]: { minPercent: 0.2, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦅' },
  [BadgeTier.TREX]: { minPercent: 0.5, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦖' },
  [BadgeTier.BLUE_WHALE]: { minPercent: 1.0, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🐳' }
};

/**
 * Format SEC amount for display
 * @param amount SEC amount to format
 * @returns Formatted SEC amount
 */
export const formatSecAmount = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  } else if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(2)}K`;
  } else {
    return amount.toFixed(2);
  }
};

/**
 * Calculate badge tier based on SEC balance
 * @param secBalance SEC token balance
 * @returns Badge information
 */
export const calculateBadgeTier = (secBalance: number): BadgeInfo => {
  // Get all tiers sorted by min percent (ascending)
  const sortedTiers = Object.entries(BADGE_TIERS)
    .map(([tier, details]) => ({
      tier: tier as BadgeTier,
      minPercent: details.minPercent,
      minHolding: (details.minPercent / 100) * TOTAL_SEC_SUPPLY,
      color: details.color,
      icon: details.icon
    }))
    .sort((a, b) => a.minPercent - b.minPercent);

  // Find the highest tier the user qualifies for
  let userTier = sortedTiers[0]; // Default to lowest tier
  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (secBalance >= sortedTiers[i].minHolding) {
      userTier = sortedTiers[i];
      break;
    }
  }

  // Find the next tier (if any)
  const currentTierIndex = sortedTiers.findIndex(t => t.tier === userTier.tier);
  const nextTier = currentTierIndex < sortedTiers.length - 1 
    ? sortedTiers[currentTierIndex + 1] 
    : null;

  // Create the badge info
  const badgeInfo: BadgeInfo = {
    tier: userTier.tier,
    color: userTier.color,
    icon: userTier.icon,
    minHolding: userTier.minHolding,
    percentOfSupply: userTier.minPercent
  };

  // Add next tier info if available
  if (nextTier) {
    badgeInfo.nextTier = {
      name: nextTier.tier,
      minHolding: nextTier.minHolding,
      remaining: nextTier.minHolding - secBalance
    };
  }

  return badgeInfo;
};
