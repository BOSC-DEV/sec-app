
import { useState, useEffect } from 'react';
import { calculateBadgeTier, BadgeInfo, MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';
import { getDelegatedBadges } from '@/services/badgeDelegationService';
import { getProfileByWallet } from '@/services/profileService';

export const useBadgeTier = (walletAddressOrBalance: string | number | null): BadgeInfo | null => {
  const [badgeInfo, setBadgeInfo] = useState<BadgeInfo | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0); // Add a counter to force refresh
  
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const fetchBadgeInfo = async () => {
      // If null is passed, reset badge info
      if (walletAddressOrBalance === null) {
        if (isMounted) setBadgeInfo(null);
        return;
      }

      // If a number is passed, treat it as direct SEC balance
      if (typeof walletAddressOrBalance === 'number') {
        if (walletAddressOrBalance < MIN_SEC_FOR_BADGE) {
          if (isMounted) setBadgeInfo(null);
          return;
        }
        
        const calculatedBadgeInfo = calculateBadgeTier(walletAddressOrBalance);
        if (isMounted) setBadgeInfo(calculatedBadgeInfo);
        return;
      }

      // If a string is passed, treat it as wallet address
      try {
        // Add the forceRefresh counter to the log to confirm we're getting fresh data
        console.log(`Fetching badge tier for wallet ${walletAddressOrBalance} (refresh #${forceRefresh})`);
        
        // First check the wallet's own SEC balance
        const profile = await getProfileByWallet(walletAddressOrBalance);
        let ownBadgeInfo: BadgeInfo | null = null;
        
        if (profile?.sec_balance !== null && profile?.sec_balance !== undefined && profile.sec_balance >= MIN_SEC_FOR_BADGE) {
          ownBadgeInfo = calculateBadgeTier(profile.sec_balance);
        }
        
        // Check if this wallet has any delegated badges - pass a timestamp to prevent caching
        const delegations = await getDelegatedBadges(walletAddressOrBalance);
        console.log('Checking delegations for wallet:', walletAddressOrBalance, delegations);
        
        // Find a delegation where this wallet is the delegated wallet and the delegation is active
        const delegation = delegations.find(d => d.delegated_wallet === walletAddressOrBalance && d.active);
        
        if (delegation) {
          console.log('Found active delegation:', delegation);
          // Get the delegator's profile to use their SEC balance
          const delegatorProfile = await getProfileByWallet(delegation.delegator_wallet);
          if (delegatorProfile?.sec_balance && delegatorProfile.sec_balance >= MIN_SEC_FOR_BADGE) {
            const delegatedBadgeInfo = calculateBadgeTier(delegatorProfile.sec_balance);
            
            // If the user has their own badge, compare the tiers
            if (ownBadgeInfo) {
              // Get tier indices for comparison (higher index = higher tier)
              const ownTierIndex = Object.values(delegatedBadgeInfo.tier).indexOf(ownBadgeInfo.tier);
              const delegatedTierIndex = Object.values(delegatedBadgeInfo.tier).indexOf(delegatedBadgeInfo.tier);
              
              // Use the higher tier badge
              if (isMounted) setBadgeInfo(ownTierIndex >= delegatedTierIndex ? ownBadgeInfo : delegatedBadgeInfo);
              return;
            } else {
              // If user has no own badge, use the delegated one
              if (isMounted) setBadgeInfo(delegatedBadgeInfo);
              return;
            }
          }
        } else {
          console.log('No active delegation found for wallet:', walletAddressOrBalance);
        }

        // If we got here, either there's no valid delegation or the user's own badge is higher
        // Fall back to the wallet's own SEC balance if available
        if (isMounted) setBadgeInfo(ownBadgeInfo);
      } catch (error) {
        console.error("Error calculating badge tier:", error);
        if (isMounted) setBadgeInfo(null);
      }
    };

    fetchBadgeInfo();
    
    // Set up a polling interval to check for updated delegation status
    const intervalId = setInterval(() => {
      // Increment the force refresh counter to ensure we're not getting cached data
      setForceRefresh(prev => prev + 1);
      fetchBadgeInfo();
    }, 3000); // Check every 3 seconds
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [walletAddressOrBalance, forceRefresh]);
  
  return badgeInfo;
};

export default useBadgeTier;
