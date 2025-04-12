// Badge tier thresholds based on SEC coin holdings
// Total supply: 1,000,000,000 SEC

export const TOTAL_SEC_SUPPLY = 1_000_000_000;

export enum BadgeTier {
  SHRIMP = 'Shrimp',
  BULL = 'Bull',
  LION = 'Lion',
  KING_COBRA = 'King Cobra',
  HARK = 'Hark',
  GREAT_APE = 'Great Ape',
  BLUE_WHALE = 'Blue Whale'
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
  [BadgeTier.SHRIMP]: { minPercent: 0, color: 'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800', icon: '🦐' },
  [BadgeTier.BULL]: { minPercent: 0.01, color: 'text-red-500 bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800', icon: '🐂' },
  [BadgeTier.LION]: { minPercent: 0.03, color: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800', icon: '🦁' },
  [BadgeTier.KING_COBRA]: { minPercent: 0.06, color: 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800', icon: '🐍' },
  [BadgeTier.HARK]: { minPercent: 0.1, color: 'text-indigo-500 bg-indigo-100 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800', icon: '🦈' },
  [BadgeTier.GREAT_APE]: { minPercent: 0.3, color: 'text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700', icon: '🦍' },
  [BadgeTier.BLUE_WHALE]: { minPercent: 1.0, color: 'text-icc-gold bg-icc-gold/10 border-icc-gold/30 dark:bg-icc-gold/20', icon: '🐳' }
};

/**
 * Calculate badge tier based on SEC holdings
 * @param secHolding Amount of SEC tokens held
 * @returns Badge information including tier, next tier, etc.
 */
export const calculateBadgeTier = (secHolding: number): BadgeInfo => {
  const holdingPercent = (secHolding / TOTAL_SEC_SUPPLY) * 100;
  
  // Find the highest tier the user qualifies for
  // We'll sort from highest to lowest tier (by minPercent)
  // and find the first tier that the user meets the requirements for
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
  
  if (holdingPercent >= BADGE_TIERS[BadgeTier.BLUE_WHALE].minPercent) return BadgeTier.BLUE_WHALE;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.GREAT_APE].minPercent) return BadgeTier.GREAT_APE;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.HARK].minPercent) return BadgeTier.HARK;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.KING_COBRA].minPercent) return BadgeTier.KING_COBRA;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.LION].minPercent) return BadgeTier.LION;
  if (holdingPercent >= BADGE_TIERS[BadgeTier.BULL].minPercent) return BadgeTier.BULL;
  
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
