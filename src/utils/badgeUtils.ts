
// Badge tier thresholds based on SEC coin holdings
// Total supply: 1,000,000,000 SEC

export const TOTAL_SEC_SUPPLY = 1_000_000_000;

export enum BadgeTier {
  SHRIMP = 'Shrimp',
  CRAB = 'Crab',
  ALLIGATOR = 'Alligator',
  OCTOPUS = 'Octopus',
  KING_COBRA = 'King Cobra',
  DOLPHIN = 'Dolphin',
  SHARK = 'Shark',
  WHALE = 'Whale'
}

export interface BadgeInfo {
  tier: BadgeTier;
  icon: string;
  color: string;
  minHolding: number;
  percentOfSupply: number;
  nextTier?: {
    name: BadgeTier;
    minHolding: number;
    remaining: number;
  };
}

// Badge tiers with corresponding thresholds
export const BADGE_TIERS: { [key in BadgeTier]: { minPercent: number, color: string, icon: string } } = {
  [BadgeTier.SHRIMP]: { minPercent: 0, color: 'text-pink-400 bg-pink-100 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800', icon: '🦐' },
  [BadgeTier.CRAB]: { minPercent: 0.01, color: 'text-red-500 bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800', icon: '🦀' },
  [BadgeTier.ALLIGATOR]: { minPercent: 0.03, color: 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800', icon: '🐊' },
  [BadgeTier.OCTOPUS]: { minPercent: 0.06, color: 'text-purple-500 bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800', icon: '🐙' },
  [BadgeTier.KING_COBRA]: { minPercent: 0.1, color: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800', icon: '🐍' },
  [BadgeTier.DOLPHIN]: { minPercent: 0.3, color: 'text-blue-500 bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800', icon: '🐬' },
  [BadgeTier.SHARK]: { minPercent: 0.6, color: 'text-gray-700 bg-gray-100 border-gray-200 dark:bg-gray-800/40 dark:border-gray-700 dark:text-gray-300', icon: '🦈' },
  [BadgeTier.WHALE]: { minPercent: 1.0, color: 'text-icc-gold bg-icc-gold/10 border-icc-gold/30 dark:bg-icc-gold/20', icon: '🐳' }
};

/**
 * Calculate badge tier based on SEC holdings
 * @param secHolding Amount of SEC tokens held
 * @returns Badge information including tier, next tier, etc.
 */
export const calculateBadgeTier = (secHolding: number): BadgeInfo => {
  const holdingPercent = (secHolding / TOTAL_SEC_SUPPLY) * 100;
  
  // Find the highest tier the user qualifies for
  const tiers = Object.entries(BADGE_TIERS).sort(
    (a, b) => b[1].minPercent - a[1].minPercent
  );
  
  let userTier = tiers[tiers.length - 1]; // Default to lowest tier (Shrimp)
  
  for (const [tier, { minPercent }] of tiers) {
    if (holdingPercent >= minPercent) {
      userTier = [tier, BADGE_TIERS[tier as BadgeTier]];
      break;
    }
  }
  
  const currentTierIndex = tiers.findIndex(([t]) => t === userTier[0]);
  const nextTierInfo = currentTierIndex > 0 ? {
    name: tiers[currentTierIndex - 1][0] as BadgeTier,
    minHolding: (tiers[currentTierIndex - 1][1].minPercent / 100) * TOTAL_SEC_SUPPLY,
    remaining: ((tiers[currentTierIndex - 1][1].minPercent / 100) * TOTAL_SEC_SUPPLY) - secHolding
  } : undefined;
  
  return {
    tier: userTier[0] as BadgeTier,
    color: userTier[1].color,
    icon: userTier[1].icon,
    minHolding: (userTier[1].minPercent / 100) * TOTAL_SEC_SUPPLY,
    percentOfSupply: userTier[1].minPercent,
    nextTier: nextTierInfo
  };
};

/**
 * Get badge tier from holdings without additional info
 * @param secHolding Amount of SEC tokens held
 * @returns Badge tier enum value
 */
export const getBadgeTier = (secHolding: number): BadgeTier => {
  const holdingPercent = (secHolding / TOTAL_SEC_SUPPLY) * 100;
  
  if (holdingPercent >= BADGE_TIERS[BadgeTier.WHALE].minPercent) return BadgeTier.WHALE;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.SHARK].minPercent) return BadgeTier.SHARK;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.DOLPHIN].minPercent) return BadgeTier.DOLPHIN;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.KING_COBRA].minPercent) return BadgeTier.KING_COBRA;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.OCTOPUS].minPercent) return BadgeTier.OCTOPUS;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.ALLIGATOR].minPercent) return BadgeTier.ALLIGATOR;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.CRAB].minPercent) return BadgeTier.CRAB;
  
  return BadgeTier.SHRIMP;
};

/**
 * Format SEC amounts for display
 * @param amount SEC amount
 * @returns Formatted string with appropriate units (K, M, B)
 */
export const formatSecAmount = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2)}B`;
  } else if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  } else if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(2)}K`;
  } else {
    return amount.toFixed(2);
  }
};
