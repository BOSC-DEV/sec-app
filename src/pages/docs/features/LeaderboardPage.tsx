
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Trophy, TrendingUp, Users, Award, Star, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LeaderboardPage = () => {
  return (
    <DocsContent 
      title="Leaderboard System" 
      description="Track top contributors and compete to become a leading scammer hunter in the SEC community"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Leaderboard Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Trophy className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC Leaderboard recognizes and celebrates our most active community members. 
              Climb the ranks by reporting scammers, contributing bounties, and engaging with 
              the community to help create a safer crypto ecosystem.
            </p>
          </div>
        </section>

        {/* Ranking Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Leaderboard Categories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Target className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Top Reporters</h3>
              <p className="mb-4">
                Users who have submitted the most verified scammer reports, helping to build 
                our comprehensive database of bad actors.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Total number of reports submitted</li>
                <li>• Quality and verification status of reports</li>
                <li>• Community engagement on reports</li>
                <li>• Evidence quality and completeness</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Award className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Top Contributors</h3>
              <p className="mb-4">
                Community members who have contributed the most SOL to bounties, incentivizing 
                scammer exposure and accountability.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Total bounty contributions in SOL</li>
                <li>• Number of different bounties supported</li>
                <li>• Strategic contribution patterns</li>
                <li>• Community impact of contributions</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Champions</h3>
              <p className="mb-4">
                Active participants who engage heavily in community discussions, provide 
                valuable insights, and help other users.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Comments and replies to reports</li>
                <li>• Chat participation and helpfulness</li>
                <li>• Likes and positive community feedback</li>
                <li>• Mentoring and guidance provided</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Star className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Overall Ranking</h3>
              <p className="mb-4">
                Comprehensive ranking that combines all activities including reports, 
                contributions, engagement, and community impact.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Weighted scoring across all categories</li>
                <li>• Badge tier influence on rankings</li>
                <li>• Consistency and sustained activity</li>
                <li>• Quality over quantity emphasis</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Scoring System */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How Scoring Works</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Report Submissions</h3>
                <p>Each verified scammer report earns base points, with bonuses for detailed evidence, photos, and comprehensive information.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Bounty Contributions</h3>
                <p>Points awarded based on SOL contributed to bounties, encouraging financial support for scammer accountability.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
                <p>Meaningful comments, helpful replies, and positive community interactions contribute to overall score.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality Multipliers</h3>
                <p>Badge tiers and account verification status provide multipliers to encourage serious participation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Leaderboard Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-sm">Rankings update automatically as new activities are recorded</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Profile Integration</h3>
              <p className="text-sm">Leaderboard positions displayed on user profiles and throughout the platform</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Award className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Achievement Recognition</h3>
              <p className="text-sm">Special badges and recognition for top performers in each category</p>
            </div>
          </div>
        </section>

        {/* Rewards & Recognition */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Rewards & Recognition</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Top 10 Recognition</h4>
              <p className="text-yellow-700 dark:text-yellow-300">
                Top 10 users in each category receive special recognition and visibility on their profiles
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Badge Progression</h4>
              <p className="text-blue-700 dark:text-blue-300">
                High leaderboard positions contribute to badge tier advancement and unlock platform privileges
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Community Status</h4>
              <p className="text-green-700 dark:text-green-300">
                Leaderboard champions become recognized community leaders and trusted voices
              </p>
            </div>
          </div>
        </section>

        {/* Fair Play */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Fair Play & Anti-Gaming</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Integrity Measures</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Quality over quantity scoring prevents spam</li>
              <li>• Community verification required for high-impact actions</li>
              <li>• Suspicious activity monitoring and investigation</li>
              <li>• Penalties for gaming or manipulation attempts</li>
              <li>• Regular algorithm updates to maintain fairness</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Climb the Leaderboard</h2>
          <p className="mb-6">Start contributing to the community today and see your name rise in the rankings!</p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/leaderboard">View Current Leaderboard</Link>
          </Button>
        </section>
      </div>
    </DocsContent>
  );
};

export default LeaderboardPage;
