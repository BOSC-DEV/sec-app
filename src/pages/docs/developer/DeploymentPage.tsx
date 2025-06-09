
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Cloud, Server, Settings, Monitor, Shield, Zap } from 'lucide-react';

const DeploymentPage = () => {
  return (
    <DocsContent 
      title="Deployment Guide" 
      description="Complete guide to deploying the SEC platform to production environments"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Deployment Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Cloud className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform is designed for easy deployment using modern hosting services. 
              This guide covers deployment to Vercel, Netlify, and other platforms, along with 
              environment configuration and production best practices.
            </p>
          </div>
        </section>

        {/* Quick Deploy Options */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Quick Deploy Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Cloud className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Vercel (Recommended)</h3>
              <p className="mb-4">
                Optimized for React applications with automatic deployments.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Zero-config deployment</li>
                <li>• Automatic HTTPS and CDN</li>
                <li>• GitHub integration</li>
                <li>• Environment variable management</li>
                <li>• Preview deployments for PRs</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Server className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Netlify</h3>
              <p className="mb-4">
                Great alternative with similar features and performance.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Git-based deployments</li>
                <li>• Form handling and functions</li>
                <li>• Redirects and rewrites</li>
                <li>• Split testing capabilities</li>
                <li>• Analytics and monitoring</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Environment Configuration */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Environment Configuration</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Supabase Setup</h3>
                <p>Configure your Supabase project and obtain the required credentials.</p>
                <div className="mt-2 bg-black text-green-400 p-3 rounded font-mono text-sm">
                  VITE_SUPABASE_URL=your-project-url<br/>
                  VITE_SUPABASE_ANON_KEY=your-anon-key
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Optional Services</h3>
                <p>Configure additional services for enhanced functionality.</p>
                <div className="mt-2 bg-black text-green-400 p-3 rounded font-mono text-sm">
                  VITE_ANALYTICS_ID=analytics-tracking-id<br/>
                  VITE_SENTRY_DSN=error-tracking-dsn
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vercel Deployment */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Deploying to Vercel</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Step-by-Step Deployment</h3>
            <ol className="space-y-3">
              <li><strong>1. Connect Repository:</strong> Link your GitHub repo to Vercel</li>
              <li><strong>2. Configure Project:</strong> Set framework preset to "Vite"</li>
              <li><strong>3. Environment Variables:</strong> Add all required environment variables</li>
              <li><strong>4. Deploy:</strong> Click deploy and wait for build completion</li>
              <li><strong>5. Custom Domain:</strong> (Optional) Add your custom domain</li>
            </ol>
            
            <h4 className="font-semibold mt-6 mb-3">Vercel CLI Deployment</h4>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              {`# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY`}
            </div>
          </div>
        </section>

        {/* Netlify Deployment */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Deploying to Netlify</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Manual Deployment</h4>
              <ol className="mt-2 space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                <li>1. Build the project locally: <code>npm run build</code></li>
                <li>2. Drag and drop the <code>dist</code> folder to Netlify</li>
                <li>3. Configure environment variables in site settings</li>
                <li>4. Set up redirects for SPA routing</li>
              </ol>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Git-Based Deployment</h4>
              <ol className="mt-2 space-y-1 text-green-700 dark:text-green-300 text-sm">
                <li>1. Connect your Git repository</li>
                <li>2. Set build command: <code>npm run build</code></li>
                <li>3. Set publish directory: <code>dist</code></li>
                <li>4. Add environment variables</li>
                <li>5. Deploy automatically on push</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Build Configuration */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Build Configuration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Settings className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Build Settings</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Build Command:</strong> <code>npm run build</code></div>
                <div><strong>Output Directory:</strong> <code>dist</code></div>
                <div><strong>Node Version:</strong> 18 or higher</div>
                <div><strong>Package Manager:</strong> npm or yarn</div>
              </div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Zap className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Performance</h3>
              <ul className="space-y-2 text-sm">
                <li>• Code splitting enabled</li>
                <li>• Asset optimization</li>
                <li>• Gzip compression</li>
                <li>• CDN distribution</li>
                <li>• Caching headers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Custom Domain Setup */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Custom Domain Setup</h2>
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">DNS Configuration</h3>
              <p className="mb-4">Configure your DNS records to point to your hosting provider:</p>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
                {`# For Vercel
Type: CNAME
Name: www (or your subdomain)
Value: cname.vercel-dns.com

# For Netlify
Type: CNAME
Name: www
Value: your-site-name.netlify.app

# Apex domain (optional)
Type: A
Name: @
Value: [provided IP addresses]`}
              </div>
            </div>
          </div>
        </section>

        {/* Production Monitoring */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Production Monitoring</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Monitor className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Uptime Monitoring</h3>
              <p className="text-sm">Monitor site availability and performance</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Error Tracking</h3>
              <p className="text-sm">Track and resolve production errors quickly</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Server className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm">Monitor user behavior and platform usage</p>
            </div>
          </div>
        </section>

        {/* Security Considerations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Security in Production</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Security Headers</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300 text-sm">
                <li>• Content Security Policy (CSP)</li>
                <li>• HTTP Strict Transport Security (HSTS)</li>
                <li>• X-Frame-Options</li>
                <li>• X-Content-Type-Options</li>
                <li>• Referrer-Policy</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Environment Security</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                <li>• Use environment variables for secrets</li>
                <li>• Enable HTTPS/SSL certificates</li>
                <li>• Configure proper CORS settings</li>
                <li>• Regular security updates</li>
                <li>• Monitor for vulnerabilities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Common Deployment Issues</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Build Failures</h4>
              <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                <li>• Check Node.js version compatibility</li>
                <li>• Verify all dependencies are installed</li>
                <li>• Ensure environment variables are set</li>
                <li>• Review build logs for specific errors</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Runtime Issues</h4>
              <ul className="mt-2 space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                <li>• Verify Supabase configuration</li>
                <li>• Check browser console for errors</li>
                <li>• Ensure routing is configured correctly</li>
                <li>• Test wallet connection functionality</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Maintenance */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Ongoing Maintenance</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Regular Tasks</h3>
            <ul className="space-y-2">
              <li>• Monitor application performance and errors</li>
              <li>• Keep dependencies updated for security</li>
              <li>• Review and rotate API keys periodically</li>
              <li>• Backup configuration and environment variables</li>
              <li>• Monitor Supabase usage and limits</li>
              <li>• Test disaster recovery procedures</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default DeploymentPage;
