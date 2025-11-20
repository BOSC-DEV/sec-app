
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Coins, Target, TrendingUp, Users, Gift, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BountiesGuidePage = () => {
  return (
    <DocsContent 
      title="Managing Bounties" 
      description="Complete guide to contributing, transferring, and managing bounties in the SEC ecosystem"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Bounty System Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Coins className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The bounty system incentivizes community participation by allowing users to 
              contribute SEC tokens to reports. Higher bounties increase visibility 
              and encourage more thorough investigations and evidence gathering.
            </p>
          </div>
        </section>

        {/* How Bounties Work */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How Bounties Work</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Contributing Bounties</h3>
              <p className="mb-4">
                Add SEC tokens to any report to increase its bounty pool.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Connect your Phantom wallet</li>
                <li>• Choose the amount to contribute</li>
                <li>• Add an optional comment</li>
                <li>• Confirm the transaction</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Bounty Impact</h3>
              <p className="mb-4">
                Higher bounties create more incentive for community engagement.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Increased visibility in searches</li>
                <li>• More likely to be featured</li>
                <li>• Attracts community attention</li>
                <li>• Encourages evidence sharing</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contributing to Bounties */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Contributing to Bounties</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Find a Report</h3>
                <p>Browse the database and find a report you want to support with additional bounty.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Contribution Amount</h3>
                <p>Decide how many SEC tokens you want to contribute. Consider the severity of the incident and current bounty amount.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add Context</h3>
                <p>Include a comment explaining why you're contributing or adding additional evidence about the scammer.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Complete Transaction</h3>
                <p>Approve the transaction in your Phantom wallet. Your contribution will be recorded on the blockchain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bounty Transfers */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Bounty Transfers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Transfer Between Reports</h3>
              <p className="text-sm">Move your contributions between different scammer reports</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Gift className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Reward Contributors</h3>
              <p className="text-sm">Transfer bounties to users who provide valuable evidence</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Secure Transactions</h3>
              <p className="text-sm">All transfers are recorded on the blockchain for transparency</p>
            </div>
          </div>
        </section>

        {/* Managing Your Contributions */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Managing Your Contributions</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Track Your Bounty Activity</h3>
            <p className="mb-4">
              Monitor all your bounty contributions and transfers through your profile dashboard.
            </p>
            <ul className="space-y-2">
              <li>• View all your contributions by scammer report</li>
              <li>• See total amount contributed across all reports</li>
              <li>• Track transfers you've initiated or received</li>
              <li>• Monitor the impact of your contributions</li>
              <li>• Access transaction history and signatures</li>
            </ul>
          </div>
        </section>

        {/* Bounty Strategy */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Effective Bounty Strategy</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">High-Impact Scammers</h4>
              <p className="text-green-700 dark:text-green-300">
                Focus bounties on scammers who have caused significant financial damage or pose ongoing threats
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Emerging Threats</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Contribute to new reports about active scammers to quickly warn the community
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Quality Evidence</h4>
              <p className="text-purple-700 dark:text-purple-300">
                Reward reports with comprehensive evidence and clear documentation
              </p>
            </div>
          </div>
        </section>

        {/* Bounty Economics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Understanding Bounty Economics</h2>
          <div className="grid gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Token Utility</h3>
              <ul className="space-y-2">
                <li>• SEC tokens fuel the bounty ecosystem</li>
                <li>• Higher bounties increase report visibility</li>
                <li>• Contributions are tracked for leaderboard rankings</li>
                <li>• Active participation may unlock badge tiers</li>
                <li>• Community governance through token-weighted voting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Bounty Best Practices</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Due Diligence</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• Verify the quality of evidence before contributing</li>
                <li>• Check if the scammer is still active</li>
                <li>• Consider the potential impact of your contribution</li>
                <li>• Review existing comments and community discussion</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Responsible Contributing</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                <li>• Only contribute to reports with solid evidence</li>
                <li>• Avoid contributing to questionable or unverified reports</li>
                <li>• Don't let emotions drive large contributions</li>
                <li>• Report suspicious bounty activity to moderators</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Troubleshooting Common Issues</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Common Problems & Solutions</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• <strong>Transaction Failed:</strong> Check wallet balance and network fees</li>
              <li>• <strong>Pending Transaction:</strong> Wait for blockchain confirmation</li>
              <li>• <strong>Wrong Amount:</strong> Double-check decimals and token amounts</li>
              <li>• <strong>Missing Contribution:</strong> Verify transaction signature on blockchain</li>
              <li>• <strong>Transfer Issues:</strong> Ensure you have permission to transfer</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Start Contributing to Bounties</h2>
          <p className="mb-6">Help incentivize scammer exposure by contributing to bounty pools.</p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/">Browse Scammer Reports</Link>
          </Button>
        </section>
      </div>
    </DocsContent>
  );
};

export default BountiesGuidePage;
