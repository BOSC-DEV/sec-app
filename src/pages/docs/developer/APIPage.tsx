
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Code, Database, Shield, Zap, Key, Globe } from 'lucide-react';

const APIPage = () => {
  return (
    <DocsContent 
      title="API Documentation" 
      description="Complete reference for integrating with the SEC platform API endpoints and services"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">API Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Code className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform provides a comprehensive REST API built on Supabase, 
              enabling developers to integrate report submission, bounty management, 
              and community features into their own applications.
            </p>
          </div>
        </section>

        {/* Authentication */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Authentication</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Key className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">API Keys</h3>
              <p className="mb-4">
                Authenticate using Supabase service role keys for server-side access.
              </p>
              <div className="bg-background p-4 rounded font-mono text-sm">
                Authorization: Bearer YOUR_SUPABASE_ANON_KEY
              </div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Row Level Security</h3>
              <p className="mb-4">
                All endpoints respect RLS policies ensuring users can only access authorized data.
              </p>
              <div className="bg-background p-4 rounded font-mono text-sm">
                X-User-ID: user_uuid_here
              </div>
            </div>
          </div>
        </section>

        {/* Core Endpoints */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Core API Endpoints</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-green-600">GET /scammers</h3>
              <p className="mb-4">Retrieve a list of reported scammers with optional filtering and pagination.</p>
              <div className="bg-muted p-4 rounded">
                <pre className="text-sm">
{`{
  "data": [
    {
      "scammer_id": "uuid",
      "name": "John Scammer",
      "total_bounty": 1500,
      "report_count": 5,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 150,
  "page": 1
}`}
                </pre>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">POST /scammers</h3>
              <p className="mb-4">Submit a new scammer report with evidence and details.</p>
              <div className="bg-muted p-4 rounded">
                <pre className="text-sm">
{`{
  "name": "Jane Fraudster",
  "crypto_addresses": ["1A2B3C..."],
  "scam_type": "investment_fraud",
  "evidence": "Detailed evidence description",
  "photos": ["photo_url_1", "photo_url_2"]
}`}
                </pre>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-red-600">POST /reports/scammer</h3>
              <p className="mb-4">Submit a report with comprehensive details including evidence, wallet addresses, and supporting documentation.</p>
              <div className="bg-muted p-4 rounded">
                <pre className="text-sm">
{`{
  "scammer_name": "Crypto Fraudster",
  "accused_of": "Investment fraud and rug pull",
  "wallet_addresses": ["1A2B3C4D...", "5E6F7G8H..."],
  "aliases": ["John Crypto", "BitcoinJohn"],
  "accomplices": ["Jane Doe", "Bob Smith"],
  "links": ["https://fraudulent-site.com"],
  "evidence_description": "Screenshots and transaction logs",
  "photo_evidence": "base64_image_data_or_url",
  "official_response": "Scammer's public statement"
}`}
                </pre>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-600">POST /bounties/contribute</h3>
              <p className="mb-4">Add SEC tokens to a scammer's bounty pool.</p>
              <div className="bg-muted p-4 rounded">
                <pre className="text-sm">
{`{
  "scammer_id": "uuid",
  "amount": 100,
  "comment": "This scammer needs to be stopped",
  "transaction_signature": "tx_signature"
}`}
                </pre>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-orange-600">POST /bounties/transfer</h3>
              <p className="mb-4">Transfer bounty tokens between users or scammer reports.</p>
              <div className="bg-muted p-4 rounded">
                <pre className="text-sm">
{`{
  "from_scammer_id": "uuid",
  "to_scammer_id": "uuid",
  "amount": 50,
  "reason": "Better evidence found"
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Response Formats */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Response Formats</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-600">Success Response</h3>
              <div className="bg-background p-4 rounded font-mono text-sm">
{`{
  "success": true,
  "data": { ... },
  "message": "Operation completed"
}`}
              </div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-red-600">Error Response</h3>
              <div className="bg-background p-4 rounded font-mono text-sm">
{`{
  "success": false,
  "error": "Invalid request",
  "code": "VALIDATION_ERROR"
}`}
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limiting */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Rate Limiting</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">API Limits</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• 100 requests per minute for authenticated users</li>
              <li>• 10 requests per minute for unauthenticated requests</li>
              <li>• 1000 requests per hour for premium users</li>
              <li>• Rate limit headers included in all responses</li>
            </ul>
          </div>
        </section>

        {/* SDK Examples */}
        <section>
          <h2 className="text-2xl font-bold mb-6">SDK Examples</h2>
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">JavaScript/TypeScript</h3>
              <div className="bg-background p-4 rounded font-mono text-sm">
{`import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Fetch scammers
const { data, error } = await supabase
  .from('scammers')
  .select('*')
  .limit(10)`}
              </div>
            </div>
          </div>
        </section>

        {/* Webhooks */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Webhooks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Database className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">New Reports</h3>
              <p className="text-sm">Triggered when new reports are submitted</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Bounty Updates</h3>
              <p className="text-sm">Notifications for bounty contributions and transfers</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Globe className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Community Events</h3>
              <p className="text-sm">Real-time updates for chat and community interactions</p>
            </div>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default APIPage;
