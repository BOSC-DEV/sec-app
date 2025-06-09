
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Database, Server, Shield, Zap, Cloud, Lock } from 'lucide-react';

const BackendPage = () => {
  return (
    <DocsContent 
      title="Backend Integration" 
      description="Understanding the backend services, database design, and API architecture powering the SEC platform"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Backend Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Server className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform leverages Supabase as a comprehensive backend-as-a-service, 
              providing PostgreSQL database, real-time subscriptions, authentication, 
              and serverless functions in a unified ecosystem.
            </p>
          </div>
        </section>

        {/* Supabase Services */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Supabase Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Database className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">PostgreSQL Database</h3>
              <p className="mb-4">
                High-performance PostgreSQL with advanced features and real-time capabilities.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• ACID compliance</li>
                <li>• Full-text search</li>
                <li>• JSON/JSONB support</li>
                <li>• Advanced indexing</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Zap className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-time Engine</h3>
              <p className="mb-4">
                Live updates across all connected clients with minimal latency.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• WebSocket connections</li>
                <li>• Database change streams</li>
                <li>• Presence tracking</li>
                <li>• Broadcast messaging</li>
              </ul>
            </div>
          </div>
        </section>

        {/* API Architecture */}
        <section>
          <h2 className="text-2xl font-bold mb-6">API Architecture</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">RESTful API</h3>
                <p>Auto-generated REST endpoints from database schema with filtering, sorting, and pagination.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-time Subscriptions</h3>
                <p>Subscribe to database changes for live chat, notifications, and data synchronization.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Edge Functions</h3>
                <p>Serverless TypeScript functions for custom business logic and external integrations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Authentication System</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Lock className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Wallet Authentication</h3>
              <p className="text-sm">Phantom wallet integration for seamless Web3 authentication</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">JWT Tokens</h3>
              <p className="text-sm">Secure token-based authentication with automatic refresh</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Cloud className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Session Management</h3>
              <p className="text-sm">Persistent sessions with configurable expiration policies</p>
            </div>
          </div>
        </section>

        {/* Data Services */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Core Data Services</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Scammer Registry Service</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Manages scammer records with full-text search, image storage, and validation
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Community Service</h4>
              <p className="text-green-700 dark:text-green-300">
                Handles chat messages, announcements, reactions, and user interactions
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Notification Service</h4>
              <p className="text-purple-700 dark:text-purple-300">
                Real-time notification delivery with type-based filtering and read status
              </p>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Analytics Service</h4>
              <p className="text-orange-700 dark:text-orange-300">
                Page views, user engagement, and platform statistics tracking
              </p>
            </div>
          </div>
        </section>

        {/* File Storage */}
        <section>
          <h2 className="text-2xl font-bold mb-6">File Storage & CDN</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Supabase Storage</h3>
            <p className="mb-4">
              Scalable object storage with CDN delivery for images and documents.
            </p>
            <ul className="space-y-2">
              <li>• Image compression and optimization</li>
              <li>• Multiple format support (JPEG, PNG, WebP)</li>
              <li>• Automatic resizing and thumbnails</li>
              <li>• Secure upload with virus scanning</li>
              <li>• Global CDN distribution</li>
              <li>• Access control and permissions</li>
            </ul>
          </div>
        </section>

        {/* Integration Patterns */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Integration Patterns</h2>
          <div className="grid gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Data Fetching</h3>
              <ul className="space-y-2">
                <li>• TanStack Query for client-side caching</li>
                <li>• Optimistic updates for better UX</li>
                <li>• Background refetching strategies</li>
                <li>• Error handling and retry logic</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
              <ul className="space-y-2">
                <li>• WebSocket connections for live data</li>
                <li>• Channel-based subscriptions</li>
                <li>• Presence indicators for online users</li>
                <li>• Automatic reconnection handling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Performance & Monitoring */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Performance & Monitoring</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Database Optimization</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• Indexed queries for fast searches</li>
                <li>• Connection pooling</li>
                <li>• Query optimization</li>
                <li>• Materialized views for analytics</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Monitoring & Logging</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                <li>• Real-time error tracking</li>
                <li>• Performance metrics</li>
                <li>• Usage analytics</li>
                <li>• Health checks and alerts</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default BackendPage;
