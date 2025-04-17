
import { useState, useEffect } from 'react';
import { calculateBadgeTier, BadgeInfo, MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';
import { getDelegatedBadges } from '@/services/badgeDelegationService';
import { getProfileByWallet } from '@/services/profileService';

export const useBadgeTier = (walletAddress: string | null): BadgeInfo | null => {
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(null);
  
  useEffect(() => {
    const fetchBadgeInfo = async () => {
      if (!walletAddress) {
        setBadgeInfo(null);
        return;
      }

      try {
        // First check if this wallet has any delegated badges
        const delegations = await getDelegatedBadges(walletAddress);
        if (delegations.length > 0) {
          // Find a delegation where this wallet is the delegated wallet
          const delegation = delegations.find(d => d.delegated_wallet === walletAddress && d.active);
          
          if (delegation) {
            // Get the delegator's profile to use their SEC balance
            const delegatorProfile = await getProfileByWallet(delegation.delegator_wallet);
            if (delegatorProfile?.sec_balance) {
              const delegatedBadgeInfo = calculateBadgeTier(delegatorProfile.sec_balance);
              setBadgeInfo(delegatedBadgeInfo);
              return;
            }
          }
        }

        // If no valid delegation found, fall back to the wallet's own SEC balance
        const profile = await getProfileByWallet(walletAddress);
        if (profile?.sec_balance !== null && profile?.sec_balance !== undefined) {
          if (profile.sec_balance < MIN_SEC_FOR_BADGE) {
            setBadgeInfo(null);
            return;
          }
          
          const calculatedBadgeInfo = calculateBadgeTier(profile.sec_balance);
          setBadgeInfo(calculatedBadgeInfo);
        }
      } catch (error) {
        console.error("Error calculating badge tier:", error);
        setBadgeInfo(null);
      }
    };

    fetchBadgeInfo();
  }, [walletAddress]);
  
  return badgeInfo;
};

export default useBadgeTier;
