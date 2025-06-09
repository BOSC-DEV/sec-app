
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Bell, AlertCircle, MessageSquare, Megaphone, Settings, Users } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <DocsContent 
      title="Notification System" 
      description="Stay informed with real-time notifications about platform activity and community updates"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Notification Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Bell className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              Stay connected and informed with our comprehensive notification system. Never miss 
              important updates, community interactions, or critical security alerts.
            </p>
          </div>
        </section>

        {/* Notification Types */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Types of Notifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Megaphone className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Platform Announcements</h3>
              <p className="mb-4">
                Official updates from the SEC team and important community announcements 
                from verified contributors.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• New feature releases and updates</li>
                <li>• Security alerts and warnings</li>
                <li>• Platform maintenance notifications</li>
                <li>• Community surveys and polls</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <MessageSquare className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Interactions</h3>
              <p className="mb-4">
                Notifications about interactions with your content and community activities 
                you're involved in.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Replies to your comments</li>
                <li>• Likes on your reports or comments</li>
                <li>• Mentions in chat or discussions</li>
                <li>• Follow-ups on your reports</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <AlertCircle className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Security Alerts</h3>
              <p className="mb-4">
                Critical security notifications about new scams, threats, and safety 
                information relevant to the crypto community.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• New high-priority scammer reports</li>
                <li>• Trending scam techniques</li>
                <li>• Wallet security warnings</li>
                <li>• Emergency community alerts</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Badge & Achievement Updates</h3>
              <p className="mb-4">
                Notifications about your progress, badge tier changes, and community 
                recognition achievements.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Badge tier promotions</li>
                <li>• Leaderboard position changes</li>
                <li>• Milestone achievements</li>
                <li>• Special recognition awards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">In-Platform Notifications</h3>
                <p>Real-time notifications displayed within the SEC platform interface, accessible through the notification bell icon.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Browser Notifications</h3>
                <p>Push notifications to your browser even when the SEC platform isn't actively open, for critical alerts and updates.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Notification Frequency</h3>
                <p>Customize how often you receive different types of notifications, from immediate alerts to daily digests.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Managing Notifications */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Managing Your Notifications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Bell className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Notification Center</h3>
              <p className="text-sm">Access all your notifications in one place, mark as read, and view notification history</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Settings className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Custom Preferences</h3>
              <p className="text-sm">Fine-tune which notifications you receive and how you want to be alerted</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Priority Levels</h3>
              <p className="text-sm">Different notification types have priority levels, ensuring critical alerts are never missed</p>
            </div>
          </div>
        </section>

        {/* Notification Etiquette */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Best Practices</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">For Users</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Check notifications regularly for important updates</li>
                <li>• Respond promptly to community interactions</li>
                <li>• Enable browser notifications for security alerts</li>
                <li>• Customize settings to avoid notification overload</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">For Contributors</h4>
              <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Use notifications responsibly when creating announcements</li>
                <li>• Ensure important information reaches the community</li>
                <li>• Respect users' notification preferences</li>
                <li>• Provide valuable, actionable information</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Technical Implementation</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Real-Time System</h3>
            <p className="mb-4">
              Our notification system uses real-time technology to ensure immediate delivery 
              of critical information:
            </p>
            <ul className="space-y-2">
              <li>• WebSocket connections for instant in-app notifications</li>
              <li>• Browser push notification API for out-of-app alerts</li>
              <li>• Intelligent batching to prevent notification spam</li>
              <li>• Persistent storage for notification history</li>
              <li>• Cross-device synchronization for consistent experience</li>
            </ul>
          </div>
        </section>

        {/* Privacy & Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Notification Privacy</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• No personal information shared in notifications</li>
              <li>• Secure delivery through encrypted connections</li>
              <li>• User control over all notification settings</li>
              <li>• No tracking or analytics on notification content</li>
              <li>• Opt-out available for all notification types</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default NotificationsPage;
