
import React from 'react';
import { BADGE_TIERS, BadgeTier, formatSecAmount, TOTAL_SEC_SUPPLY } from '@/utils/badgeUtils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BadgeComparisonChart from './BadgeComparisonChart';
import { ChartContainer, ChartLegendContent, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const BadgeTiersPage: React.FC = () => {
  // Prepare data for the pie chart
  const badgeTierData = Object.entries(BADGE_TIERS)
    .map(([tier, data]) => {
      const minHolding = (data.minPercent / 100) * TOTAL_SEC_SUPPLY;
      let value: number;
      
      // Calculate the range for each tier
      if (tier === BadgeTier.SHRIMP) {
        value = 100_000; // Fixed value for Shrimp
      } else {
        const tiers = Object.entries(BADGE_TIERS).sort((a, b) => a[1].minPercent - b[1].minPercent);
        const currentIndex = tiers.findIndex(([t]) => t === tier);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < tiers.length) {
          const nextMinHolding = (tiers[nextIndex][1].minPercent / 100) * TOTAL_SEC_SUPPLY;
          value = nextMinHolding - minHolding;
        } else {
          // For the highest tier
          value = TOTAL_SEC_SUPPLY * 0.05; // Just for visualization
        }
      }
      
      return {
        name: tier,
        value,
        color: data.color.split(' ')[0], // Get the text color class
        icon: data.icon,
        minHolding,
      };
    })
    .sort((a, b) => {
      const tierOrder = Object.keys(BadgeTier);
      return tierOrder.indexOf(a.name) - tierOrder.indexOf(b.name);
    });

  const chartConfig = badgeTierData.reduce((config, item) => {
    // Extract a color that works well for the chart from the Tailwind class
    const colorMap: Record<string, string> = {
      'text-pink-400': '#ec4899',
      'text-red-500': '#ef4444',
      'text-blue-600': '#2563eb',
      'text-yellow-600': '#ca8a04',
      'text-green-600': '#16a34a',
      'text-indigo-500': '#6366f1',
      'text-amber-700': '#b45309',
      'text-icc-gold': '#fbbf24',
    };
    
    return {
      ...config,
      [item.name]: {
        label: item.name,
        color: colorMap[item.color] || '#64748b',
        icon: item.icon,
      },
    };
  }, {});

  return (
    <div className="space-y-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BadgeComparisonChart />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Badge Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={badgeTierData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={1}
                    label={({ name, icon }) => `${icon} ${name}`}
                    labelLine={false}
                  >
                    {badgeTierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartConfig[entry.name].color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const tier = badgeTierData.find(t => t.name === payload[0].name);
                        if (!tier) return null;
                        
                        return (
                          <div className="p-2 bg-background border border-border/50 rounded-lg shadow-md">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="mr-2">{tier.icon}</span>
                                <span className="font-semibold">{tier.name}</span>
                              </div>
                              <div className="text-xs">
                                Min: {formatSecAmount(tier.minHolding)} SEC
                                {tier.name !== BadgeTier.SHRIMP && (
                                  <span> ({(tier.minHolding / TOTAL_SEC_SUPPLY * 100).toFixed(2)}%)</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 text-sm text-muted-foreground">
            Hover over the chart to see details for each badge tier
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Badge Tier Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🦐</span> Shrimp
              </h3>
              <p className="text-sm text-muted-foreground">Basic community access with standard features.</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🐂</span> Bull & <span className="mr-2 ml-2">🦈</span> Shark
              </h3>
              <p className="text-sm text-muted-foreground">Enhanced visibility in community discussions and early access to announcements.</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🦁</span> Lion & <span className="mr-2 ml-2">🐍</span> King Cobra
              </h3>
              <p className="text-sm text-muted-foreground">Increased voting power on community proposals and access to exclusive events.</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🐋</span> Killer Whale & <span className="mr-2 ml-2">🦍</span> Great Ape 
              </h3>
              <p className="text-sm text-muted-foreground">Priority support, special platform features, and participation in strategic decisions.</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">🐳</span> Blue Whale
              </h3>
              <p className="text-sm text-muted-foreground">Elite status with maximum platform benefits, including direct access to the core team and influence on platform development.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeTiersPage;
