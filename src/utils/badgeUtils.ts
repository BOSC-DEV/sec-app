
export const BADGE_TIERS: { [key in BadgeTier]: { minPercent: number, color: string, icon: string } } = {
  [BadgeTier.Shrimp]: { minPercent: 0, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦐' },
  [BadgeTier.Bull]: { minPercent: 0.01, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🐂' },
  [BadgeTier.Lion]: { minPercent: 0.03, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦁' },
  [BadgeTier.KingCobra]: { minPercent: 0.06, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🐍' },
  [BadgeTier.BullShark]: { minPercent: 0.1, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦈' },
  [BadgeTier.GreatApe]: { minPercent: 0.3, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦍' },
  [BadgeTier.GoldenEagle]: { minPercent: 0.2, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦅' },
  [BadgeTier.TRex]: { minPercent: 0.5, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🦖' },
  [BadgeTier.BlueWhale]: { minPercent: 1.0, color: 'text-icc-blue bg-icc-blue/10 border-icc-blue/30 dark:bg-icc-blue/20', icon: '🐳' }
};
