
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Code, Database, Key, Zap, Globe, Shield } from 'lucide-react';

const APIPage = () => {
  return (
    <DocsContent 
      title="API Reference" 
      description="Complete API documentation for developers integrating with the SEC platform"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">API Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Code className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform provides a comprehensive REST API built on Supabase, offering 
              real-time data access, authentication, and full CRUD operations. All endpoints 
              include proper authentication and rate limiting for security.
            </p>
          </div>
        </section>

        {/* Base URL & Authentication */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Base URL & Authentication</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Globe className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Base URL</h3>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-sm">
                https://your-project.supabase.co/rest/v1/
              </div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Key className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Authentication</h3>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-sm">
                Authorization: Bearer YOUR_JWT_TOKEN<br/>
                apikey: YOUR_ANON_KEY
              </div>
            </div>
          </div>
        </section>

        {/* Core Endpoints */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Core API Endpoints</h2>
          <div className="space-y-6">
            
            {/* Scammers API */}
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Scammers API</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
                    <code className="text-sm">/scammers</code>
                  </div>
                  <p className="text-sm mb-2">Retrieve all scammer records with optional filtering</p>
                  <div className="text-xs">
                    <strong>Query Parameters:</strong><br/>
                    • limit, offset (pagination)<br/>
                    • order (sorting)<br/>
                    • name.ilike (search by name)<br/>
                    • bounty_amount.gte (minimum bounty)
                  </div>
                </div>

                <div className="p-4 bg-muted rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
                    <code className="text-sm">/scammers?id=eq.{id}</code>
                  </div>
                  <p className="text-sm">Get a specific scammer by ID</p>
                </div>

                <div className="p-4 bg-muted rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">POST</span>
                    <code className="text-sm">/scammers</code>
                  </div>
                  <p className="text-sm">Create a new scammer report (requires authentication)</p>
                </div>

                <div className="p-4 bg-muted rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">PATCH</span>
                    <code className="text-sm">/scammers?id=eq.{id}</code>
                  </div>
                  <p className="text-sm">Update scammer information (requires authentication)</p>
                </div>
              </div>
            </div>

            {/* Comments API */}
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Comments API</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
                    <code className="text-sm">/comments?scammer_id=eq.{id}</code>
                  </div>
                  <p className="text-sm">Get all comments for a specific scammer</p>
                </div>

                <div className="p-4 bg-muted rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">POST</span>
                    <code className="text-sm">/comments</code>
                  </div>
                  <p className="text-sm">Add a new comment (requires authentication)</p>
                </div>
              </div>
            </div>

            {/* Bounty API */}
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Bounty Contributions API</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
                    <code className="text-sm">/bounty_contributions?scammer_id=eq.{id}</code>
                  </div>
                  <p className="text-sm">Get all bounty contributions for a scammer</p>
                </div>

                <div className="p-4 bg-muted rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">POST</span>
                    <code className="text-sm">/bounty_contributions</code>
                  </div>
                  <p className="text-sm">Create a new bounty contribution (requires authentication)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Subscriptions */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Real-time Subscriptions</h2>
          <div className="bg-muted rounded-lg p-6">
            <Zap className="h-8 w-8 text-icc-gold mb-4" />
            <h3 className="text-xl font-semibold mb-3">WebSocket Subscriptions</h3>
            <p className="mb-4">
              Subscribe to real-time updates using Supabase's real-time engine.
            </p>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              {`const supabase = createClient(url, key)

// Subscribe to new chat messages
const subscription = supabase
  .channel('chat_messages')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'chat_messages' },
    (payload) => {
      console.log('New message:', payload.new)
    }
  )
  .subscribe()

// Subscribe to scammer updates
const scammerSub = supabase
  .channel('scammers')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'scammers' },
    (payload) => {
      console.log('Scammer updated:', payload)
    }
  )
  .subscribe()`}
            </div>
          </div>
        </section>

        {/* Response Formats */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Response Formats</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Success Response</h4>
              <div className="mt-2 bg-black text-green-400 p-3 rounded font-mono text-sm">
                {`{
  "data": [...],
  "count": 150,
  "status": 200,
  "statusText": "OK"
}`}
              </div>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Error Response</h4>
              <div className="mt-2 bg-black text-red-400 p-3 rounded font-mono text-sm">
                {`{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "JSON object requested, multiple (or no) rows returned"
}`}
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limiting */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Rate Limiting & Security</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Rate Limits</h3>
              <p className="text-sm">1000 requests per hour per IP address</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Key className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Authentication</h3>
              <p className="text-sm">JWT tokens with Row Level Security</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Database className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Data Access</h3>
              <p className="text-sm">RLS policies enforce user permissions</p>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Code Examples</h2>
          
          <div className="space-y-6">
            {/* JavaScript Example */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">JavaScript/TypeScript</h3>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                {`import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'
const supabase = createClient(supabaseUrl, supabaseKey)

// Get all scammers
const { data, error } = await supabase
  .from('scammers')
  .select('*')
  .order('bounty_amount', { ascending: false })
  .limit(10)

// Search scammers by name
const { data: searchResults } = await supabase
  .from('scammers')
  .select('*')
  .ilike('name', '%john%')

// Add a comment
const { data: newComment } = await supabase
  .from('comments')
  .insert({
    scammer_id: 'scammer-id',
    author: 'user-wallet-address',
    content: 'Additional evidence...'
  })`}
              </div>
            </div>

            {/* Python Example */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Python</h3>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                {`from supabase import create_client, Client

url = "https://your-project.supabase.co"
key = "your-anon-key"
supabase: Client = create_client(url, key)

# Get scammers with high bounties
response = supabase.table('scammers').select("*").gte('bounty_amount', 1000).execute()
scammers = response.data

# Create a new scammer report
new_scammer = {
    "id": "new-scammer-id",
    "name": "Scammer Name",
    "accused_of": "Detailed accusation...",
    "bounty_amount": 0
}
result = supabase.table('scammers').insert(new_scammer).execute()`}
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Error Handling</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Common HTTP Status Codes</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                <li>• <strong>200:</strong> Success</li>
                <li>• <strong>201:</strong> Created successfully</li>
                <li>• <strong>400:</strong> Bad request (invalid parameters)</li>
                <li>• <strong>401:</strong> Unauthorized (invalid or missing token)</li>
                <li>• <strong>403:</strong> Forbidden (insufficient permissions)</li>
                <li>• <strong>404:</strong> Resource not found</li>
                <li>• <strong>429:</strong> Too many requests (rate limited)</li>
                <li>• <strong>500:</strong> Internal server error</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SDK and Libraries */}
        <section>
          <h2 className="text-2xl font-bold mb-6">SDKs and Libraries</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Official Supabase SDKs</h3>
            <ul className="space-y-2">
              <li>• <strong>JavaScript/TypeScript:</strong> @supabase/supabase-js</li>
              <li>• <strong>Python:</strong> supabase-py</li>
              <li>• <strong>Dart/Flutter:</strong> supabase-flutter</li>
              <li>• <strong>Go:</strong> supabase-go</li>
              <li>• <strong>Swift:</strong> supabase-swift</li>
              <li>• <strong>C#:</strong> supabase-csharp</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default APIPage;
