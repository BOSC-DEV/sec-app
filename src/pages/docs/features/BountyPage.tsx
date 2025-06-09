
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Coins, Target, TrendingUp, Users, Award, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BountyPage = () => {
  return (
    <DocsContent 
      title="Bounty System" 
      description="Learn how the token-based reward system incentivizes scammer exposure and community participation"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Bounty System Overview</h2>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white mb-6">
            <Coins className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC bounty system creates financial incentives for exposing scammers and fraudulent 
              activities. Community members can contribute SEC tokens to bounties, increasing the reward for 
              bringing scammers to justice.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How Bounties Work</h2>
          <div className="grid gap-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Scammer Reported</h3>
                <p>A community member submits a detailed report about a scammer, creating a new bounty target.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Contributes</h3>
                <p>Other users can add SEC tokens to the bounty, increasing the total reward pool for that scammer.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Evidence Accumulates</h3>
                <p>More evidence and verification from the community strengthens the case and increases visibility.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Justice Served</h3>
                <p>When the scammer is apprehended or funds recovered, bounty contributors are rewarded proportionally.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contributing to Bounties */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Contributing to Bounties</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Minimum Contribution</h3>
              <p>You can contribute as few as 1 SEC token to any bounty. Every contribution counts and helps increase the incentive.</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Proportional Rewards</h3>
              <p>Your share of any recovered funds is proportional to your contribution to the total bounty amount.</p>
            </div>
          </div>
        </section>

        {/* Bounty Types */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Types of Bounties</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg text-center">
              <Award className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <h3 className="font-semibold mb-2 text-red-600">High Priority</h3>
              <p className="text-sm">Major scammers with significant victim impact</p>
              <div className="mt-3 px-3 py-1 bg-red-100 dark:bg-red-900 rounded-full text-xs">
                1000+ SEC Average
              </div>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <Award className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-semibold mb-2 text-yellow-600">Medium Priority</h3>
              <p className="text-sm">Scammers with moderate community impact</p>
              <div className="mt-3 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-full text-xs">
                100-1000 SEC Average
              </div>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <Award className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2 text-green-600">Standard</h3>
              <p className="text-sm">Newly reported or smaller scale scams</p>
              <div className="mt-3 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-xs">
                10-100 SEC Average
              </div>
            </div>
          </div>
        </section>

        {/* Bounty Strategy */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Strategic Bounty Participation</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <Users className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Early Contribution Benefits</h4>
                <p className="text-blue-700 dark:text-blue-300">Contributing early to bounties can increase visibility and attract more contributors, potentially leading to faster resolution.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <TrendingUp className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">Diversify Your Portfolio</h4>
                <p className="text-green-700 dark:text-green-300">Consider contributing smaller amounts to multiple bounties rather than putting everything into one target.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reward Distribution */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Reward Distribution</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">How Rewards Are Calculated</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-background rounded">
                <span>Your Contribution</span>
                <span className="font-mono">500 SEC</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded">
                <span>Total Bounty Pool</span>
                <span className="font-mono">5000 SEC</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded">
                <span>Your Share</span>
                <span className="font-mono text-icc-gold">10%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-icc-gold text-icc-blue-dark rounded font-semibold">
                <span>Recovered Amount (if 10,000 SEC recovered)</span>
                <span className="font-mono">1,000 SEC</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              All recovered funds are used to buy back SEC and distribute to contributors of each bounty
            </p>
          </div>
        </section>

        {/* Risks and Considerations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Risks & Considerations</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Important Disclaimers</h3>
                <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
                  <li>• Bounty contributions are not guaranteed to be recovered</li>
                  <li>• Some scammers may never be caught or funds recovered</li>
                  <li>• Legal processes can take months or years to complete</li>
                  <li>• Only contribute amounts you can afford to lose</li>
                  <li>• This is not investment advice - participate responsibly</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="mb-6">Join the community in fighting fraud by contributing to active bounties.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="gold" size="lg" asChild>
              <Link to="/most-wanted">View Bounties</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/leaderboard">Top Contributors</Link>
            </Button>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default BountyPage;
