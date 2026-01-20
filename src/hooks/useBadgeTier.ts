import { useState, useEffect } from 'react';
import { calculateBadgeTier, calculateBadgeTierWithBounties, BadgeInfo } from '@/utils/badgeUtils';

/**
 * Hook to get badge tier information based on SEC balance
 * @param secBalance The user's SEC balance (can be null/undefined if not loaded yet)
 * @returns Badge information or null if below threshold
 */
export const useBadgeTier = (secBalance: number | null): BadgeInfo | null => {
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(null);
  
  useEffect(() => {
    try {
      // Calculate the badge tier (everyone gets at least Shrimp since MIN_SEC_FOR_BADGE is 0)
      const calculatedBadgeInfo = calculateBadgeTier(secBalance ?? 0);
      setBadgeInfo(calculatedBadgeInfo);
    } catch (error) {
      console.error("Error calculating badge tier:", error);
      // Default to Shrimp tier calculation in case of error
      setBadgeInfo(calculateBadgeTier(0));
    }
  }, [secBalance]);
  
  return badgeInfo;
};

/**
 * Hook to get badge tier information based on combined SEC balance and bounties raised
 * @param secBalance The user's SEC balance (can be null/undefined if not loaded yet)
 * @param bountiesRaised The total bounties raised from user's scam reports (in SEC tokens)
 * @returns Badge information or null if below threshold
 */
export const useBadgeTierWithBounties = (
  secBalance: number | null, 
  bountiesRaised: number | null
): BadgeInfo | null => {
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(null);
  
  useEffect(() => {
    const sec = secBalance ?? 0;
    const bounties = bountiesRaised ?? 0;
    
    try {
      // Calculate using bounties-aware function (both values are in SEC)
      const calculatedBadgeInfo = calculateBadgeTierWithBounties(sec, bounties);
      setBadgeInfo(calculatedBadgeInfo);
      
      if (calculatedBadgeInfo) {
        console.log(`Badge tier: ${calculatedBadgeInfo.tier} (SEC: ${sec}, Bounties: ${bounties}, Total: ${sec + bounties})`);
      }
    } catch (error) {
      console.error("Error calculating badge tier with bounties:", error);
      setBadgeInfo(null);
    }
  }, [secBalance, bountiesRaised]);
  
  return badgeInfo;
};

export default useBadgeTier;
