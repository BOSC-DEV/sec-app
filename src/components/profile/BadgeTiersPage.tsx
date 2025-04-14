import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatSecAmount, BADGE_TIERS, BadgeTier, TOTAL_SEC_SUPPLY } from '@/utils/badgeUtils';
import BadgeTierComponent from '@/components/profile/BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import { useProfile } from '@/contexts/ProfileContext';
import { Progress } from '@/components/ui/progress';

const BadgeTiersPage = () => {
  const { profile } = useProfile();
  const secBalance = profile?.sec_balance || 0;
  const [currentBadgeInfo, setCurrentBadgeInfo] = useState(calculateBadgeTier(secBalance));
  
  useEffect(() => {
    setCurrentBadgeInfo(calculateBadgeTier(secBalance));
    console.log(`Current SEC balance: ${secBalance}, Badge tier: ${calculateBadgeTier(secBalance).tier}`);
  }, [secBalance]);

  const tiers = Object.entries(BADGE_TIERS).map(([tier, details]) => ({
    tier: tier as BadgeTier,
    minPercent: details.minPercent,
    minHolding: (details.minPercent / 100) * TOTAL_SEC_SUPPLY,
    color: details.color,
    icon: details.icon,
  }));

  const sortedTiers = [...tiers].sort((a, b) => a.minPercent - b.minPercent);

  const tiersWithProgress = sortedTiers.map((tierInfo, index) => {
    const nextTier = index < sortedTiers.length - 1 ? sortedTiers[index + 1] : null;
    
    let progressPercentage = 0;
    let progressText = '';
    
    if (secBalance >= tierInfo.minHolding) {
      if (nextTier) {
        const range = nextTier.minHolding - tierInfo.minHolding;
        const progress = secBalance - tierInfo.minHolding;
        progressPercentage = Math.min(100, (progress / range) * 100);
        progressText = `${formatSecAmount(secBalance)} / ${formatSecAmount(nextTier.minHolding)} SEC`;
      } else {
        progressPercentage = 100;
        progressText = `${formatSecAmount(secBalance)} SEC (Max Tier)`;
      }
    } else {
      progressPercentage = Math.min(100, (secBalance / tierInfo.minHolding) * 100);
      progressText = `${formatSecAmount(secBalance)} / ${formatSecAmount(tierInfo.minHolding)} SEC`;
    }
    
    return {
      ...tierInfo,
      progress: progressPercentage,
      progressText,
      isCurrentTier: currentBadgeInfo.tier === tierInfo.tier,
      isUnlocked: secBalance >= tierInfo.minHolding
    };
  });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-icc-gold">Badge Tiers</CardTitle>
          <CardDescription>
            SEC token holders earn special badges based on their holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Badge</TableHead>
                  <TableHead>Minimum Holding</TableHead>
                  <TableHead>% of Supply</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiersWithProgress.map((tierInfo) => {
                  const badgeInfo = {
                    tier: tierInfo.tier === 'Blue Whale' ? 'Whale' : tierInfo.tier,
                    color: tierInfo.color,
                    icon: tierInfo.icon,
                    minHolding: tierInfo.minHolding,
                    percentOfSupply: tierInfo.minPercent,
                    nextTier: undefined,
                  };

                  return (
                    <TableRow key={tierInfo.tier} className={tierInfo.isCurrentTier ? "bg-primary/5" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BadgeTierComponent
                            badgeInfo={badgeInfo}
                            showTooltip={true}
                          />
                          <span className="font-medium">
                            {badgeInfo.tier}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatSecAmount(tierInfo.minHolding)} SEC
                      </TableCell>
                      <TableCell>
                        {tierInfo.minPercent}%
                      </TableCell>
                      <TableCell className="w-64">
                        <div className="space-y-1">
                          <Progress value={tierInfo.progress} className={`h-2 ${tierInfo.isUnlocked ? "bg-primary/20" : "bg-muted"}`} />
                          <p className="text-xs text-muted-foreground">{tierInfo.progressText}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-dashed text-sm">
            <h4 className="font-medium mb-2">About Badges</h4>
            <p className="text-muted-foreground">
              Badges are automatically assigned based on your SEC token holdings. Higher tier badges 
              grant exclusive benefits and increased visibility in the community.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeTiersPage;
