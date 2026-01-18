import { useState, useEffect } from 'react';
import { calculateBadgeTier, calculateBadgeTierWithBounties, BadgeInfo, MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';

/**
 * Hook to get badge tier information based on SEC balance
 * @param secBalance The user's SEC balance (can be null/undefined if not loaded yet)
 * @returns Badge information or null if below threshold
 */
export const useBadgeTier = (secBalance: number | null): BadgeInfo | null => {
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(null);
  
  useEffect(() => {
    if (secBalance !== null && secBalance !== undefined) {
      try {
        // If the balance is less than minimum required, set to null
        if (secBalance < MIN_SEC_FOR_BADGE) {
          setBadgeInfo(null);
          console.log(`No badge awarded: SEC balance ${secBalance} is below minimum requirement of ${MIN_SEC_FOR_BADGE}`);
          return;
        }
        
        // Otherwise calculate the badge tier
        const calculatedBadgeInfo = calculateBadgeTier(secBalance);
        setBadgeInfo(calculatedBadgeInfo);
        console.log(`Badge tier calculated: ${calculatedBadgeInfo?.tier || 'None'} for balance: ${secBalance}`);
      } catch (error) {
        console.error("Error calculating badge tier:", error);
        // Set to null in case of error
        setBadgeInfo(null);
      }
    }
  }, [secBalance]);
  
  return badgeInfo;
};

/**
 * Hook to get badge tier information based on SEC balance OR bounties raised (whichever is higher)
 * @param secBalance The user's SEC balance (can be null/undefined if not loaded yet)
 * @param bountiesRaised The total bounties raised from user's scam reports (in SOL)
 * @param solToSecRate Optional rate to convert SOL to SEC equivalent (defaults to 1000)
 * @returns Badge information or null if below threshold
 */
export const useBadgeTierWithBounties = (
  secBalance: number | null, 
  bountiesRaised: number | null,
  solToSecRate: number = 1000
): BadgeInfo | null => {
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(null);
  
  useEffect(() => {
    const sec = secBalance ?? 0;
    const bounties = bountiesRaised ?? 0;
    
    try {
      // Calculate using bounties-aware function
      const calculatedBadgeInfo = calculateBadgeTierWithBounties(sec, bounties, solToSecRate);
      setBadgeInfo(calculatedBadgeInfo);
      
      const bountiesAsSecEquiv = bounties * solToSecRate;
      if (calculatedBadgeInfo) {
        const source = bountiesAsSecEquiv > sec ? 'bounties' : 'holdings';
        console.log(`Badge tier: ${calculatedBadgeInfo.tier} (qualified via ${source})`);
      }
    } catch (error) {
      console.error("Error calculating badge tier with bounties:", error);
      setBadgeInfo(null);
    }
  }, [secBalance, bountiesRaised, solToSecRate]);
  
  return badgeInfo;
};

export default useBadgeTier;
