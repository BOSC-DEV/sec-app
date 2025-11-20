
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Coins, TrendingUp, Users, Zap, Target, BarChart3 } from 'lucide-react';

const TokenomicsPage = () => {
  return (
    <DocsContent 
      title="Tokenomics" 
      description="Understanding the SEC token economics, distribution, and utility within the platform ecosystem"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Tokenomics Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Coins className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC token is the native utility token of the Scams & E-crimes Commission 
              platform. It powers the bounty system, incentivizes quality reporting, and 
              enables community governance while maintaining a sustainable economic model.
            </p>
          </div>
        </section>

        {/* Token Utility */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Token Utility</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Primary Functions</h3>
              <ul className="space-y-2 text-sm">
                <li>• Bounty contributions to reports</li>
                <li>• Incentivizing high-quality content</li>
                <li>• Community governance participation</li>
                <li>• Badge tier progression rewards</li>
                <li>• Platform feature access</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Zap className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Value Drivers</h3>
              <ul className="space-y-2 text-sm">
                <li>• Increased platform adoption</li>
                <li>• Higher quality reports</li>
                <li>• Community engagement growth</li>
                <li>• Deflationary mechanisms</li>
                <li>• Utility expansion</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Token Distribution */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Token Distribution</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-muted rounded-lg text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
                <h3 className="font-semibold mb-2">Community Rewards</h3>
                <div className="text-2xl font-bold text-icc-gold mb-2">40%</div>
                <p className="text-sm">Distributed to users for reporting, engagement, and contributions</p>
              </div>
              <div className="p-6 bg-muted rounded-lg text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
                <h3 className="font-semibold mb-2">Platform Development</h3>
                <div className="text-2xl font-bold text-icc-gold mb-2">25%</div>
                <p className="text-sm">Reserved for ongoing development and platform improvements</p>
              </div>
              <div className="p-6 bg-muted rounded-lg text-center">
                <Coins className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
                <h3 className="font-semibold mb-2">Initial Liquidity</h3>
                <div className="text-2xl font-bold text-icc-gold mb-2">20%</div>
                <p className="text-sm">Provided for initial trading liquidity and market making</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted rounded-lg text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
                <h3 className="font-semibold mb-2">Team & Advisors</h3>
                <div className="text-2xl font-bold text-icc-gold mb-2">10%</div>
                <p className="text-sm">Team allocation with vesting schedule</p>
              </div>
              <div className="p-6 bg-muted rounded-lg text-center">
                <Zap className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
                <h3 className="font-semibold mb-2">Ecosystem Growth</h3>
                <div className="text-2xl font-bold text-icc-gold mb-2">5%</div>
                <p className="text-sm">Partnerships, marketing, and ecosystem expansion</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bounty Economics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Bounty System Economics</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Contribution Mechanics</h3>
                <p>Users contribute SEC tokens to specific reports, increasing the bounty pool and incentivizing community engagement.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reward Distribution</h3>
                <p>Bounties can be transferred to users who provide valuable evidence, additional information, or significant contributions to investigations.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Visibility Boost</h3>
                <p>Higher bounty amounts increase report visibility in search results and featured sections, creating natural market dynamics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Emission & Supply */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Token Supply & Emission</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Supply Mechanics</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Initial Supply:</strong> 1,000,000,000 SEC tokens</li>
                <li>• <strong>Emission Rate:</strong> Decreasing over time</li>
                <li>• <strong>Maximum Supply:</strong> Capped at 10 billion tokens</li>
                <li>• <strong>Minting:</strong> Controlled by governance</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Deflationary Mechanisms</h3>
              <ul className="space-y-2 text-sm">
                <li>• Platform fees partially burned</li>
                <li>• Inactive account token recycling</li>
                <li>• Governance-approved burns</li>
                <li>• Premium feature token consumption</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Governance Model */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Governance Model</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Token-Weighted Voting</h3>
            <p className="mb-4">
              SEC token holders participate in platform governance through a democratic 
              voting system weighted by token holdings and community engagement.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Voting Power Factors</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Token holdings (50% weight)</li>
                  <li>• Platform engagement (30% weight)</li>
                  <li>• Badge tier level (20% weight)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Governance Scope</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Platform feature updates</li>
                  <li>• Community guidelines changes</li>
                  <li>• Token economic parameters</li>
                  <li>• Treasury allocation decisions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Economic Incentives */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Economic Incentive Structure</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Quality Reporting Rewards</h4>
              <p className="text-green-700 dark:text-green-300">
                Users receive SEC tokens for creating comprehensive, well-evidenced reports that benefit the community
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Community Engagement</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Active participation in discussions, providing helpful comments, and contributing evidence earns token rewards
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Badge Progression</h4>
              <p className="text-purple-700 dark:text-purple-300">
                Advancing through badge tiers provides token bonuses and unlocks additional earning opportunities
              </p>
            </div>
          </div>
        </section>

        {/* Market Dynamics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Market Dynamics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Demand Drivers</h3>
              <p className="text-sm">Platform growth, bounty contributions, governance participation</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Supply Factors</h3>
              <p className="text-sm">Controlled emission, community rewards, deflationary burns</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Utility Growth</h3>
              <p className="text-sm">Expanding use cases, premium features, ecosystem development</p>
            </div>
          </div>
        </section>

        {/* Staking & Rewards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Staking & Long-term Rewards</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Staking Mechanics</h3>
            <p className="mb-4">
              Users can stake SEC tokens to earn additional rewards and gain enhanced 
              governance participation while supporting platform security.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Staking Benefits</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Passive token earnings</li>
                  <li>• Enhanced voting power</li>
                  <li>• Priority feature access</li>
                  <li>• Exclusive community events</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Staking Tiers</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Bronze: 1,000 SEC (2% APY)</li>
                  <li>• Silver: 10,000 SEC (4% APY)</li>
                  <li>• Gold: 100,000 SEC (6% APY)</li>
                  <li>• Whale: 1,000,000 SEC (8% APY)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Factors */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Risk Considerations</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Important Risk Factors</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Cryptocurrency market volatility</li>
              <li>• Regulatory uncertainty in various jurisdictions</li>
              <li>• Platform adoption and user growth dependencies</li>
              <li>• Technical risks and smart contract vulnerabilities</li>
              <li>• Competitive threats from similar platforms</li>
              <li>• Token concentration and whale manipulation risks</li>
            </ul>
          </div>
        </section>

        {/* Future Developments */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Future Tokenomics Evolution</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Planned Enhancements</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Near-term (6-12 months)</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Advanced staking mechanisms</li>
                  <li>• Cross-chain bridging capabilities</li>
                  <li>• Enhanced governance features</li>
                  <li>• Premium subscription models</li>
                </ul>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Long-term (1-3 years)</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Decentralized autonomous organization (DAO)</li>
                  <li>• Multi-token ecosystem</li>
                  <li>• External partnership integrations</li>
                  <li>• Advanced DeFi integrations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Investment Disclaimer</h2>
          <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">Important Notice</h3>
            <p className="text-red-700 dark:text-red-300">
              This information is for educational purposes only and does not constitute 
              financial advice. Cryptocurrency investments carry significant risks including 
              total loss of capital. Past performance does not guarantee future results. 
              Always conduct your own research and consult with financial professionals 
              before making investment decisions.
            </p>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default TokenomicsPage;
