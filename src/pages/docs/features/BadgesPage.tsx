import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Badge, Star, Trophy, Crown, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const BadgesPage = () => {
  return <DocsContent title="Badge & Tier System" description="Learn about the community recognition system and how to advance through different tiers">
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Badge System Overview</h2>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white mb-6">
            <Badge className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC badge system recognizes and rewards active community members based on their 
              contributions to the platform. Higher tier badges unlock special privileges and 
              demonstrate your commitment to fighting fraud.
            </p>
          </div>
        </section>

        {/* Tier Structure */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Badge Tiers</h2>
          <div className="grid gap-6">
            
            {/* Bronze Tier */}
            <div className="p-6 border-2 border-orange-400 rounded-lg bg-orange-50 dark:bg-orange-950">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-600">Bronze Badge</h3>
                  <p className="text-orange-700 dark:text-orange-300">Entry Level - 0-99 SEC</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Connect wallet to platform</li>
                    <li>• Submit first scammer report</li>
                    <li>• Participate in community discussions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Basic voting rights</li>
                    <li>• Community chat access</li>
                    <li>• Profile customization</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Silver Tier */}
            <div className="p-6 border-2 border-gray-400 rounded-lg bg-gray-50 dark:bg-gray-950">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-600">Silver Badge</h3>
                  <p className="text-gray-700 dark:text-gray-300">Active Member - 100-999 SEC</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 100+ SEC tokens</li>
                    <li>• 5+ verified reports</li>
                    <li>• Regular community engagement</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Enhanced voting weight</li>
                    <li>• Report priority boost</li>
                    <li>• Moderator chat access</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Gold Tier */}
            <div className="p-6 border-2 border-yellow-400 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-600">Gold Badge</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">Trusted Contributor - 1,000-9,999 SEC</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 1,000+ SEC tokens</li>
                    <li>• 25+ verified reports</li>
                    <li>• High-quality evidence</li>
                    <li>• Community recognition</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Significant voting influence</li>
                    <li>• Report verification privileges</li>
                    <li>• Special events access</li>
                    <li>• Beta feature testing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Diamond Tier */}
            <div className="p-6 border-2 border-blue-400 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-600">Diamond Badge</h3>
                  <p className="text-blue-700 dark:text-blue-300">Elite Member - 10,000+ SEC</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 10,000+ SEC tokens</li>
                    <li>• 100+ verified reports</li>
                    <li>• Major scammer exposures</li>
                    <li>• Platform advocacy</li>
                  </ul>
                </div>
                
              </div>
            </div>

            {/* Legendary Tier */}
            <div className="p-6 border-2 border-red-500 rounded-lg bg-red-50 dark:bg-red-950">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-600">Legendary Badge</h3>
                  <p className="text-red-700 dark:text-red-300">Hall of Fame - 100,000+ SEC</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 100,000+ SEC tokens</li>
                    <li>• 500+ verified reports</li>
                    <li>• Major case resolutions</li>
                    <li>• Community leadership</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Platform advisory role</li>
                    <li>• Feature development input</li>
                    <li>• Exclusive networking events</li>
                    <li>• Permanent recognition</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Earn SEC Tokens */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How to Earn SEC Tokens</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Reporting Activities</h3>
              <ul className="space-y-2">
                <li>• Submit verified scammer reports: 10-50 SEC</li>
                <li>• Provide additional evidence: 5-25 SEC</li>
                <li>• First report on major scammer: 100+ SEC</li>
                <li>• Quality documentation bonus: 20 SEC</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Community Engagement</h3>
              <ul className="space-y-2">
                <li>• Daily platform activity: 1-5 SEC</li>
                <li>• Helpful comments/replies: 2-10 SEC</li>
                <li>• Community moderation: 10-30 SEC</li>
                <li>• Educational content creation: 50+ SEC</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Badge Benefits Comparison */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Feature Access by Tier</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-gray-300 p-3 text-left">Feature</th>
                  <th className="border border-gray-300 p-3 text-center">Bronze</th>
                  <th className="border border-gray-300 p-3 text-center">Silver</th>
                  <th className="border border-gray-300 p-3 text-center">Gold</th>
                  <th className="border border-gray-300 p-3 text-center">Diamond</th>
                  <th className="border border-gray-300 p-3 text-center">Legendary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Voting Weight</td>
                  <td className="border border-gray-300 p-3 text-center">1x</td>
                  <td className="border border-gray-300 p-3 text-center">2x</td>
                  <td className="border border-gray-300 p-3 text-center">5x</td>
                  <td className="border border-gray-300 p-3 text-center">10x</td>
                  <td className="border border-gray-300 p-3 text-center">25x</td>
                </tr>
                <tr className="bg-muted">
                  <td className="border border-gray-300 p-3">Report Priority</td>
                  <td className="border border-gray-300 p-3 text-center">Normal</td>
                  <td className="border border-gray-300 p-3 text-center">+1</td>
                  <td className="border border-gray-300 p-3 text-center">+2</td>
                  <td className="border border-gray-300 p-3 text-center">+3</td>
                  <td className="border border-gray-300 p-3 text-center">Max</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Chat Privileges</td>
                  <td className="border border-gray-300 p-3 text-center">Basic</td>
                  <td className="border border-gray-300 p-3 text-center">Enhanced</td>
                  <td className="border border-gray-300 p-3 text-center">VIP</td>
                  <td className="border border-gray-300 p-3 text-center">Elite</td>
                  <td className="border border-gray-300 p-3 text-center">Admin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">View Your Badge Progress</h2>
          <p className="mb-6">Check your current tier and see what you need to advance to the next level.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="gold" size="lg" asChild>
              <Link to="/community">Badge Tiers</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/leaderboard">Top Members</Link>
            </Button>
          </div>
        </section>
      </div>
    </DocsContent>;
};
export default BadgesPage;