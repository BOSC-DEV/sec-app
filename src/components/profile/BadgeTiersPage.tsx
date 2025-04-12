
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatSecAmount, BADGE_TIERS, BadgeTier, TOTAL_SEC_SUPPLY } from '@/utils/badgeUtils';
import BadgeTierComponent from '@/components/profile/BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';

const BadgeTiersPage = () => {
  // Get all badge tiers
  const tiers = Object.entries(BADGE_TIERS).map(([tier, details]) => ({
    tier: tier as BadgeTier,
    minPercent: details.minPercent,
    minHolding: (details.minPercent / 100) * TOTAL_SEC_SUPPLY,
    color: details.color,
    icon: details.icon,
  }));

  // Sort tiers from lowest to highest
  const sortedTiers = [...tiers].sort((a, b) => a.minPercent - b.minPercent);

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
                  <TableHead>Holders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTiers.map((tierInfo) => {
                  // Create sample badge info for each tier
                  const badgeInfo = {
                    tier: tierInfo.tier,
                    color: tierInfo.color,
                    icon: tierInfo.icon,
                    minHolding: tierInfo.minHolding,
                    percentOfSupply: tierInfo.minPercent,
                    nextTier: undefined, // Not needed for display
                  };

                  return (
                    <TableRow key={tierInfo.tier}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BadgeTierComponent
                            badgeInfo={badgeInfo}
                            showTooltip={false}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatSecAmount(tierInfo.minHolding)} SEC
                      </TableCell>
                      <TableCell>
                        {tierInfo.minPercent}%
                      </TableCell>
                      <TableCell>
                        {tierInfo.tier === BadgeTier.SHRIMP ? 'Unknown' : tierInfo.tier === BadgeTier.BLUE_WHALE ? '<5' : 'Unknown'}
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
