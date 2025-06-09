
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Badge, Trophy, Coins, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BADGE_TIERS, BadgeTier, formatSecAmount, TOTAL_SEC_SUPPLY, MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';

const BadgesPage = () => {
  // Get all tiers sorted by min percent (ascending)
  const sortedTiers = Object.entries(BADGE_TIERS)
    .map(([tier, details]) => ({
      tier: tier as BadgeTier,
      minPercent: details.minPercent,
      minHolding: (details.minPercent / 100) * TOTAL_SEC_SUPPLY,
      color: details.color,
      icon: details.icon
    }))
    .sort((a, b) => a.minPercent - b.minPercent);

  return (
    <DocsContent 
      title="Badge & Tier System" 
      description="Learn about the community recognition system based on SEC token holdings"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Badge System Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Badge className="h-12 w-12 mb-4 text-white" />
            <p className="text-xl leading-relaxed">
              The SEC badge system recognizes community members based on their SEC token holdings. 
              Each badge tier represents a different level of commitment to the platform and unlocks 
              special privileges within the community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Coins className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Token-Based Recognition</h3>
              <p className="text-sm text-muted-foreground">Badges are automatically assigned based on your SEC holdings</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Trophy className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Exclusive Benefits</h3>
              <p className="text-sm text-muted-foreground">Higher tiers unlock enhanced voting power and privileges</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Progressive System</h3>
              <p className="text-sm text-muted-foreground">Clear progression path from entry level to whale status</p>
            </div>
          </div>
        </section>

        {/* Badge Requirements */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Minimum Requirements</h2>
          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
              Entry Requirement
            </h3>
            <p className="text-yellow-700 dark:text-yellow-400">
              You need at least <strong>{formatSecAmount(MIN_SEC_FOR_BADGE)} SEC tokens</strong> to qualify for your first badge. 
              This represents the minimum commitment to the SEC community.
            </p>
          </div>
        </section>

        {/* Actual Badge Tiers */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Badge Tiers</h2>
          <div className="grid gap-6">
            {sortedTiers.map((tierInfo, index) => {
              const nextTier = index < sortedTiers.length - 1 ? sortedTiers[index + 1] : null;
              
              return (
                <div key={tierInfo.tier} className="p-6 border-2 rounded-lg bg-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl">
                      {tierInfo.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-icc-gold">{tierInfo.tier}</h3>
                      <p className="text-muted-foreground">
                        {formatSecAmount(tierInfo.minHolding)} SEC ({tierInfo.minPercent}% of total supply)
                        {nextTier && (
                          <span className="ml-2">
                            → Next: {formatSecAmount(nextTier.minHolding)} SEC
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Hold {formatSecAmount(tierInfo.minHolding)} SEC tokens</li>
                        <li>• Maintain balance to keep badge status</li>
                        <li>• Connect wallet to platform</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Benefits:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Enhanced community recognition</li>
                        <li>• Special badge display in chat and profile</li>
                        <li>• Increased voting weight in community decisions</li>
                        <li>• Access to tier-specific features</li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How Badges Work */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How Badges Work</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Automatic Assignment</h3>
              <ul className="space-y-2">
                <li>• Badges are automatically calculated based on your SEC balance</li>
                <li>• Updates happen in real-time as your balance changes</li>
                <li>• No manual application or approval process required</li>
                <li>• Badge tier is the highest level you qualify for</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Badge Display</h3>
              <ul className="space-y-2">
                <li>• Badges appear next to your name in chat messages</li>
                <li>• Visible on your profile and community interactions</li>
                <li>• Shows current tier with animal emoji representation</li>
                <li>• Progress indicators show path to next tier</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Check Your Badge Status</h2>
          <p className="mb-6">
            Connect your wallet and view your current badge tier, or see all badge tiers and their requirements.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="gold" size="lg" asChild>
              <Link to="/community">View Badge Tiers</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/profile">My Profile</Link>
            </Button>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default BadgesPage;
