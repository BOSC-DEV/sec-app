
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculateBadgeTier } from '@/utils/badgeUtils';

interface DelegationHeaderProps {
  currentDelegations: number;
  delegationLimit: number;
  secBalance: number | null;
}

const DelegationHeader: React.FC<DelegationHeaderProps> = ({
  currentDelegations,
  delegationLimit,
  secBalance
}) => {
  const currentBadge = secBalance ? calculateBadgeTier(secBalance) : null;

  return (
    <CardHeader>
      <CardTitle>Badge Delegation</CardTitle>
      <CardDescription>
        Allow other users to display your {currentBadge?.tier} badge
        {(delegationLimit > 0 || secBalance === null) && (
          <div className="mt-1 text-sm text-muted-foreground">
            Delegation limit: {currentDelegations} / {secBalance === null ? 0 : delegationLimit}
          </div>
        )}
      </CardDescription>
    </CardHeader>
  );
};

export default DelegationHeader;
