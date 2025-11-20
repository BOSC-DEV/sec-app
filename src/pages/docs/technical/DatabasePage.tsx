
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Database, Table, Key, Shield, Search, BarChart3 } from 'lucide-react';

const DatabasePage = () => {
  return (
    <DocsContent 
      title="Database Schema" 
      description="Comprehensive overview of the SEC platform's PostgreSQL database structure and relationships"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Database Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Database className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform uses a PostgreSQL database with a carefully designed schema 
              optimized for performance, scalability, and data integrity. All tables include 
              Row Level Security (RLS) policies for enhanced security.
            </p>
          </div>
        </section>

        {/* Core Tables */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Core Tables</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Table className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">scammers</h3>
              <p className="mb-4">Primary table storing report information and evidence.</p>
              <ul className="space-y-2 text-sm">
                <li>• id (text) - Primary key</li>
                <li>• name, aliases, wallet_addresses</li>
                <li>• accused_of, bounty_amount</li>
                <li>• photo_url, likes, dislikes, views</li>
                <li>• accomplices, links arrays</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">profiles</h3>
              <p className="mb-4">User profile information and wallet details.</p>
              <ul className="space-y-2 text-sm">
                <li>• wallet_address (text) - Primary key</li>
                <li>• display_name, username, bio</li>
                <li>• profile_pic_url, website_link</li>
                <li>• sec_balance, points</li>
                <li>• is_admin, delegation_limit</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Community Tables */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community & Interaction Tables</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">chat_messages</h3>
                <p>Live chat messages with author information, reactions, and content.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• Real-time messaging system</li>
                  <li>• Author profile integration</li>
                  <li>• Like/dislike counters</li>
                  <li>• Image upload support</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">announcements</h3>
                <p>Official announcements and community posts with engagement metrics.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• Survey data support (JSONB)</li>
                  <li>• View tracking</li>
                  <li>• Author verification</li>
                  <li>• Rich content formatting</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">comments</h3>
                <p>User comments on scammer reports with engagement tracking.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• Linked to scammer records</li>
                  <li>• Author profile integration</li>
                  <li>• View and interaction counters</li>
                  <li>• Content moderation support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bounty System Tables */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Bounty System Tables</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Key className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">bounty_contributions</h3>
              <p className="mb-4">Individual bounty contributions and transfers.</p>
              <ul className="space-y-2 text-sm">
                <li>• contributor_id and details</li>
                <li>• amount (numeric)</li>
                <li>• transaction_signature</li>
                <li>• transfer tracking</li>
                <li>• is_active status</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <BarChart3 className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">leaderboard_stats</h3>
              <p className="mb-4">Aggregated user statistics for leaderboard.</p>
              <ul className="space-y-2 text-sm">
                <li>• total_reports, total_comments</li>
                <li>• total_likes, total_views</li>
                <li>• total_bounty contributed</li>
                <li>• last_updated timestamp</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Reaction & Interaction Tables */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Reaction & Interaction System</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Reaction Tables</h4>
              <p className="text-blue-700 dark:text-blue-300">
                chat_message_reactions, announcement_reactions, reply_reactions for tracking user engagement
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">User Interaction Tables</h4>
              <p className="text-green-700 dark:text-green-300">
                user_scammer_interactions, user_comment_interactions for tracking likes/dislikes
              </p>
            </div>
          </div>
        </section>

        {/* Notification System */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Notification System</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">notifications Table</h3>
            <p className="mb-4">
              Comprehensive notification system supporting multiple types and entities.
            </p>
            <ul className="space-y-2">
              <li>• type (like, comment, bounty, reaction, mention, system)</li>
              <li>• entity_type and entity_id for referencing</li>
              <li>• actor information (name, username, profile_pic)</li>
              <li>• recipient_id for targeted delivery</li>
              <li>• is_read status tracking</li>
            </ul>
          </div>
        </section>

        {/* Analytics Tables */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Analytics & Tracking</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Search className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Page Analytics</h3>
              <ul className="space-y-2 text-sm">
                <li>• analytics_pageviews - Page visit tracking</li>
                <li>• analytics_visitors - Visitor information</li>
                <li>• scammer_views - Scammer profile views</li>
                <li>• report_submissions - Report tracking</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Security & Compliance</h3>
              <ul className="space-y-2 text-sm">
                <li>• IP hash tracking for privacy</li>
                <li>• User agent analysis</li>
                <li>• Geographic data (optional)</li>
                <li>• Session management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Indexing & Performance */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Indexing & Performance</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Primary Indexes</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• Full-text search on scammer names and accusations</li>
                <li>• Wallet address lookups</li>
                <li>• User ID and timestamp queries</li>
                <li>• Bounty amount sorting</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Query Optimization</h4>
              <ul className="mt-2 space-y-1 text-purple-700 dark:text-purple-300">
                <li>• Materialized views for complex aggregations</li>
                <li>• Partial indexes on active records</li>
                <li>• Composite indexes for common filter combinations</li>
                <li>• JSONB indexes for survey data</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Row Level Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Row Level Security (RLS)</h2>
          <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">Security Policies</h3>
            <ul className="space-y-2 text-red-700 dark:text-red-300">
              <li>• Users can only modify their own profiles and content</li>
              <li>• Read access varies by table and user role</li>
              <li>• Admin users have elevated permissions</li>
              <li>• Public read access for scammer database</li>
              <li>• Notification privacy protection</li>
              <li>• Bounty contribution transparency</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default DatabasePage;
