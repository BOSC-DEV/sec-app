import { useState, useEffect } from 'react';
import { calculateBadgeTier, BadgeInfo, MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';

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

export default useBadgeTier;
