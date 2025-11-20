
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Users, MessageSquare, Heart, Star, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CommunityGuidePage = () => {
  return (
    <DocsContent 
      title="Community Participation" 
      description="Learn how to engage with the SEC community through chat, announcements, and collaborative features"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Community Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Users className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC community is the heart of our platform. Through collaborative discussion, 
              evidence sharing, and collective vigilance, we work together to create a safer 
              crypto ecosystem. Learn how to participate effectively and contribute meaningfully.
            </p>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Getting Started in the Community</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p>Link your Phantom wallet to access all community features and establish your identity.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Set Up Your Profile</h3>
                <p>Create a compelling profile with display name, bio, and optional social links to build trust.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Learn the Guidelines</h3>
                <p>Familiarize yourself with community standards and expectations for respectful participation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Chat */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Participating in Live Chat</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <MessageSquare className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Chat Features</h3>
              <p className="mb-4">
                Engage in real-time discussions about scammer activities and prevention.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Real-time messaging with community</li>
                <li>• React to messages with likes/dislikes</li>
                <li>• Share images and evidence</li>
                <li>• Mention other users with @username</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Heart className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Engagement Tips</h3>
              <p className="mb-4">
                Make meaningful contributions to community discussions.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Share relevant scammer alerts</li>
                <li>• Ask thoughtful questions</li>
                <li>• Provide constructive feedback</li>
                <li>• Help newcomers understand the platform</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Announcements */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Announcements</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <Crown className="h-8 w-8 text-icc-gold mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Creating Announcements</h3>
                <p>Whale badge holders can create announcements for important community updates or discussions.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• Share important scammer alerts</li>
                  <li>• Propose platform improvements</li>
                  <li>• Create community polls</li>
                  <li>• Announce significant findings</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <Star className="h-8 w-8 text-icc-gold mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Engaging with Announcements</h3>
                <p>All community members can interact with announcements through various engagement methods.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• Like or dislike announcements</li>
                  <li>• Reply with detailed comments</li>
                  <li>• Participate in polls and surveys</li>
                  <li>• Share additional evidence or context</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Commenting System */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Commenting on Reports</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Adding Value Through Comments</h3>
            <p className="mb-4">
              Comments on reports are a crucial way to add context, evidence, and warnings.
            </p>
            <ul className="space-y-2">
              <li>• Provide additional evidence or documentation</li>
              <li>• Share personal experiences with the subject</li>
              <li>• Add context about tactics or methods used</li>
              <li>• Warn about related accounts or associates</li>
              <li>• Correct or update outdated information</li>
              <li>• Ask clarifying questions about the report</li>
            </ul>
          </div>
        </section>

        {/* Reputation Building */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Building Community Reputation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Quality Contributions</h3>
              <p className="text-sm">Focus on providing valuable, accurate information to build trust</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Star className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Badge Progression</h3>
              <p className="text-sm">Earn higher badge tiers through consistent, helpful participation</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Community Recognition</h3>
              <p className="text-sm">Get recognized on leaderboards for your contributions</p>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Guidelines</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Encouraged Behavior</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Share verified information and evidence</li>
                <li>• Be respectful and professional</li>
                <li>• Help newcomers learn the platform</li>
                <li>• Provide constructive feedback</li>
                <li>• Report suspicious activities</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Prohibited Behavior</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                <li>• Personal attacks or harassment</li>
                <li>• Sharing unverified or false information</li>
                <li>• Doxxing or sharing private information</li>
                <li>• Spam or promotional content</li>
                <li>• Manipulation or coordinated inauthentic behavior</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Moderation */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Moderation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Reporting Issues</h3>
              <ul className="space-y-2 text-sm">
                <li>• Report inappropriate content or behavior</li>
                <li>• Flag potentially false or misleading reports</li>
                <li>• Alert moderators to urgent security issues</li>
                <li>• Request help with platform features</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Self-Moderation</h3>
              <ul className="space-y-2 text-sm">
                <li>• Think before posting emotional responses</li>
                <li>• Verify information before sharing</li>
                <li>• Use constructive language in disagreements</li>
                <li>• Help maintain community standards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contributing to Platform Growth */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Contributing to Platform Growth</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Content Creation</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Create comprehensive reports, share educational content, and document new scam tactics
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Community Outreach</h4>
              <p className="text-purple-700 dark:text-purple-300">
                Invite other security-minded individuals, share platform updates, and promote awareness
              </p>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Feedback & Suggestions</h4>
              <p className="text-orange-700 dark:text-orange-300">
                Provide constructive feedback on platform features and suggest improvements
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Best Practices</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Effective Participation Tips</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Stay focused on scammer prevention and education</li>
              <li>• Cite sources when sharing information</li>
              <li>• Be patient with new community members</li>
              <li>• Contribute regularly but avoid overwhelming others</li>
              <li>• Respect different perspectives and experiences</li>
              <li>• Maintain privacy while building trust</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
          <p className="mb-6">Connect with like-minded individuals working to make crypto safer for everyone.</p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/community">Visit Community Page</Link>
          </Button>
        </section>
      </div>
    </DocsContent>
  );
};

export default CommunityGuidePage;
