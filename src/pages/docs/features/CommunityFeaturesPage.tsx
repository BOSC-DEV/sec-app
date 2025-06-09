
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { MessageSquare, Users, Megaphone, BarChart3, Heart, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CommunityFeaturesPage = () => {
  return (
    <DocsContent 
      title="Community Features" 
      description="Engage with the SEC community through announcements, live chat, and collaborative features"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Community Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Users className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform thrives on community collaboration. Our community features enable 
              users to share information, discuss scammer tactics, and work together to create 
              a safer crypto ecosystem for everyone.
            </p>
          </div>
        </section>

        {/* Live Chat */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Live Community Chat</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <MessageSquare className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-Time Discussions</h3>
              <p className="mb-4">
                Engage in real-time conversations with other community members about scammer 
                activities, prevention strategies, and platform updates.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Share immediate warnings about new scams</li>
                <li>• Ask questions and get quick responses</li>
                <li>• Build connections with other security-minded users</li>
                <li>• Report suspicious activities as they happen</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Moderated Environment</h3>
              <p className="mb-4">
                Our chat is actively moderated to maintain a safe and productive environment 
                for all community members.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Admin oversight and moderation</li>
                <li>• Community guidelines enforcement</li>
                <li>• Spam and abuse prevention</li>
                <li>• Educational focus maintained</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Announcements */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Announcements</h2>
          <div className="bg-muted rounded-lg p-6 mb-6">
            <Megaphone className="h-8 w-8 text-icc-gold mb-4" />
            <h3 className="text-xl font-semibold mb-3">Official Updates & Community Posts</h3>
            <p>
              Stay informed with official SEC announcements and contribute to community discussions 
              through our announcement system.
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Admin Announcements</h4>
                <p>Important platform updates, security alerts, and official communications from the SEC team.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Whale Badge Posts</h4>
                <p>High-tier community members can create announcements to share important findings and insights.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Community Polls</h4>
                <p>Participate in decision-making through community surveys and voting on platform improvements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Interaction</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Heart className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Like & Dislike System</h3>
              <p className="text-sm">Express your opinion on reports, comments, and announcements</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Reply & Comment</h3>
              <p className="text-sm">Add context, ask questions, and share additional information</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Community Polls</h3>
              <p className="text-sm">Vote on platform decisions and community initiatives</p>
            </div>
          </div>
        </section>

        {/* Badge-Based Privileges */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Badge-Based Community Privileges</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Whale Badge Holders</h4>
              <p className="text-yellow-700 dark:text-yellow-300">
                Can create community announcements and polls, helping guide platform direction
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">All Badge Holders</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Voting power in community polls scales with badge tier, ensuring fair representation
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Active Contributors</h4>
              <p className="text-green-700 dark:text-green-300">
                Recognition through the leaderboard system for top reporters and contributors
              </p>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Guidelines</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Code of Conduct</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Be respectful and professional in all interactions</li>
              <li>• Share only verified information and evidence</li>
              <li>• No personal attacks or harassment</li>
              <li>• Stay focused on scammer prevention and education</li>
              <li>• Respect privacy and avoid doxxing</li>
              <li>• Report suspicious behavior to moderators</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
          <p className="mb-6">Connect your wallet and start participating in the SEC community today.</p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/community">Visit Community Page</Link>
          </Button>
        </section>
      </div>
    </DocsContent>
  );
};

export default CommunityFeaturesPage;
