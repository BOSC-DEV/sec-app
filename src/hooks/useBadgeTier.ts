
import { useState, useEffect } from 'react';
import { calculateBadgeTier, BadgeInfo } from '@/utils/badgeUtils';

/**
 * Hook to get badge tier information based on SEC balance
 * @param secBalance The user's SEC balance (can be null/undefined if not loaded yet)
 * @returns Badge information
 */
export const useBadgeTier = (secBalance: number | null): BadgeInfo | null => {
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(null);
  
  useEffect(() => {
    if (secBalance !== null && secBalance !== undefined) {
      setBadgeInfo(calculateBadgeTier(secBalance));
    }
  }, [secBalance]);
  
  return badgeInfo;
};

export default useBadgeTier;
