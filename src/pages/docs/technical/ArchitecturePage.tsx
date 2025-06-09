
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Server, Database, Shield, Layers, Cloud, Zap } from 'lucide-react';

const ArchitecturePage = () => {
  return (
    <DocsContent 
      title="System Architecture" 
      description="Understanding the technical foundation and infrastructure of the SEC platform"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Architecture Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Layers className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform is built on a modern, scalable architecture that combines 
              React frontend with Supabase backend services, ensuring high performance, 
              security, and real-time functionality.
            </p>
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Server className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Frontend</h3>
              <ul className="space-y-2">
                <li>• React 18 with TypeScript</li>
                <li>• Vite for build tooling</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Shadcn/ui component library</li>
                <li>• React Router for navigation</li>
                <li>• TanStack Query for state management</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Database className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Backend</h3>
              <ul className="space-y-2">
                <li>• Supabase PostgreSQL database</li>
                <li>• Real-time subscriptions</li>
                <li>• Row Level Security (RLS)</li>
                <li>• Edge Functions for serverless logic</li>
                <li>• File storage for images</li>
                <li>• Authentication system</li>
              </ul>
            </div>
          </div>
        </section>

        {/* System Components */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Core Components</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">User Interface Layer</h3>
                <p>React-based frontend with responsive design, providing intuitive user experience across all devices.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">API Gateway</h3>
                <p>Supabase API layer handling authentication, data validation, and request routing to appropriate services.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Layer</h3>
                <p>PostgreSQL database with optimized queries, indexing, and real-time capabilities for live updates.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Blockchain Integration</h3>
                <p>Solana wallet connectivity for token operations, bounty management, and user authentication.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Architecture */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Security Architecture</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Row Level Security</h3>
              <p className="text-sm">Database-level security ensuring users can only access their own data</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Real-time Validation</h3>
              <p className="text-sm">Client and server-side validation for all user inputs and transactions</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Cloud className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Secure Hosting</h3>
              <p className="text-sm">HTTPS encryption, secure headers, and DDoS protection</p>
            </div>
          </div>
        </section>

        {/* Performance & Scalability */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Performance & Scalability</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Optimization Strategies</h3>
            <ul className="space-y-2">
              <li>• Code splitting and lazy loading for optimal bundle sizes</li>
              <li>• Database indexing on frequently queried fields</li>
              <li>• Client-side caching with TanStack Query</li>
              <li>• Image optimization and CDN delivery</li>
              <li>• Real-time subscriptions for live data updates</li>
              <li>• Infinite scroll pagination for large datasets</li>
            </ul>
          </div>
        </section>

        {/* Data Flow */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Data Flow Architecture</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">User Interactions</h4>
              <p className="text-blue-700 dark:text-blue-300">
                User actions trigger React state updates, API calls to Supabase, and real-time database operations
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Real-time Updates</h4>
              <p className="text-green-700 dark:text-green-300">
                Database changes trigger real-time subscriptions, updating all connected clients instantly
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Blockchain Operations</h4>
              <p className="text-purple-700 dark:text-purple-300">
                Wallet interactions are processed through Phantom wallet, with transaction results stored in the database
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default ArchitecturePage;
