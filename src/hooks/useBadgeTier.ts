
import { useState, useEffect } from 'react';
import { calculateBadgeTier, BadgeInfo, MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';
import { getDelegatedBadges } from '@/services/badgeDelegationService';
import { getProfileByWallet } from '@/services/profileService';

export const useBadgeTier = (walletAddressOrBalance: string | number | null): BadgeInfo | null => {
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(null);
  
  useEffect(() => {
    const fetchBadgeInfo = async () => {
      // If null is passed, reset badge info
      if (walletAddressOrBalance === null) {
        setBadgeInfo(null);
        return;
      }

      // If a number is passed, treat it as direct SEC balance
      if (typeof walletAddressOrBalance === 'number') {
        if (walletAddressOrBalance < MIN_SEC_FOR_BADGE) {
          setBadgeInfo(null);
          return;
        }
        
        const calculatedBadgeInfo = calculateBadgeTier(walletAddressOrBalance);
        setBadgeInfo(calculatedBadgeInfo);
        return;
      }

      // If a string is passed, treat it as wallet address
      try {
        // First check the wallet's own SEC balance
        const profile = await getProfileByWallet(walletAddressOrBalance);
        let ownBadgeInfo: BadgeInfo | null = null;
        
        if (profile?.sec_balance !== null && profile?.sec_balance !== undefined && profile.sec_balance >= MIN_SEC_FOR_BADGE) {
          ownBadgeInfo = calculateBadgeTier(profile.sec_balance);
        }
        
        // Check if this wallet has any delegated badges
        const delegations = await getDelegatedBadges(walletAddressOrBalance);
        
        // Find a delegation where this wallet is the delegated wallet and the delegation is active
        const delegation = delegations.find(d => d.delegated_wallet === walletAddressOrBalance && d.active);
        
        if (delegation) {
          // Get the delegator's profile to use their SEC balance
          const delegatorProfile = await getProfileByWallet(delegation.delegator_wallet);
          if (delegatorProfile?.sec_balance && delegatorProfile.sec_balance >= MIN_SEC_FOR_BADGE) {
            const delegatedBadgeInfo = calculateBadgeTier(delegatorProfile.sec_balance);
            
            // If the user has their own badge, compare the tiers
            if (ownBadgeInfo) {
              // Get tier indices for comparison (higher index = higher tier)
              const ownTierIndex = Object.values(ownBadgeInfo.tier).indexOf(ownBadgeInfo.tier);
              const delegatedTierIndex = Object.values(delegatedBadgeInfo.tier).indexOf(delegatedBadgeInfo.tier);
              
              // Use the higher tier badge
              setBadgeInfo(ownTierIndex >= delegatedTierIndex ? ownBadgeInfo : delegatedBadgeInfo);
              return;
            } else {
              // If user has no own badge, use the delegated one
              setBadgeInfo(delegatedBadgeInfo);
              return;
            }
          }
        }

        // If we got here, either there's no valid delegation or the user's own badge is higher
        // Fall back to the wallet's own SEC balance if available
        setBadgeInfo(ownBadgeInfo);
      } catch (error) {
        console.error("Error calculating badge tier:", error);
        setBadgeInfo(null);
      }
    };

    fetchBadgeInfo();
  }, [walletAddressOrBalance]);
  
  return badgeInfo;
};

export default useBadgeTier;
