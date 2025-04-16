
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatSecAmount, BADGE_TIERS, BadgeTier, TOTAL_SEC_SUPPLY, MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';
import { AlertCircle } from 'lucide-react';

const BadgeComparisonChart: React.FC = () => {
  const tiers = Object.entries(BADGE_TIERS).sort((a, b) => 
    a[1].minPercent - b[1].minPercent
  );

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">SEC Holder Badge Tiers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted/40 rounded-lg border border-dashed">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Minimum {formatSecAmount(MIN_SEC_FOR_BADGE)} SEC required to receive any badge
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map(([tier, details]) => {
            const tierName = tier as BadgeTier;
            const minHolding = (details.minPercent / 100) * TOTAL_SEC_SUPPLY;
            
            return (
              <div 
                key={tierName} 
                className="flex items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="mr-3 text-3xl">{details.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{tierName}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${details.color.split(' ')[0]} text-xs`}
                    >
                      {details.minPercent}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Min: {formatSecAmount(minHolding)} SEC
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {details.minPercent}% of total supply
                  </p>
                </div>
              </div>
            );
          })}
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
  );
};

export default BadgeComparisonChart;
