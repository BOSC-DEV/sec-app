
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Globe, BookOpen, ChartBar, Users, Shield, Code, Database, Lock, Cpu, GitMerge, Network } from 'lucide-react';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({
  open,
  onOpenChange
}) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            SEC: Scams & E-crimes Commission
          </DialogTitle>
          <DialogDescription>
            Technical Whitepaper v1.0 - April 2025
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="bg-gradient-to-r from-icc-blue/5 via-icc-gold/5 to-icc-blue/5 p-6 rounded-lg">
              <h3 className="font-bold text-lg text-center flex items-center justify-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-icc-gold" />
                Abstract
              </h3>
              <p className="text-base leading-relaxed">
                The Scams & E-crimes Commission (SEC) represents a paradigm shift in digital asset security through its innovative 
                community-driven approach to identifying, documenting, and deterring cryptocurrency fraud. By leveraging collective intelligence, 
                blockchain technology, and economic incentives, SEC creates a transparent and actionable database of verified scam reports 
                while fostering a collaborative ecosystem for fraud prevention.
              </p>
            </div>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Shield className="h-4 w-4 text-icc-gold" />
                1. Mission & Vision
              </h4>
              <div className="pl-4 space-y-3">
                <p>
                  <span className="font-semibold">Mission:</span> To create a safer digital asset ecosystem by empowering communities to 
                  collectively identify, verify, and deter cryptocurrency scams through decentralized coordination and economic incentives.
                </p>
                <p>
                  <span className="font-semibold">Vision:</span> A cryptocurrency landscape where fraudulent actors find it increasingly 
                  difficult to operate due to rapid identification, comprehensive documentation, and community-driven deterrence mechanisms.
                </p>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <ChartBar className="h-4 w-4 text-icc-gold" />
                2. Core System Components
              </h4>
              <div className="pl-4 space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">2.1 Reporting Infrastructure</h5>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Structured Documentation:</span> Standardized forms for detailed scam reports including wallet addresses, transaction evidence, and communication records</li>
                    <li><span className="font-medium">Evidence Validation:</span> Multi-stage verification process ensuring report accuracy and credibility</li>
                    <li><span className="font-medium">Cross-Reference System:</span> Interconnected database linking related scam patterns and actors</li>
                  </ul>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">2.2 Economic Incentives</h5>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Bounty System:</span> Community-funded rewards for identifying and verifying scammer information</li>
                    <li><span className="font-medium">Reputation Mechanism:</span> Tiered badge system based on SEC token holdings and contribution quality</li>
                    <li><span className="font-medium">Value Distribution:</span> Fair allocation of rewards to incentivize sustained community participation</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Users className="h-4 w-4 text-icc-gold" />
                3. Community Governance
              </h4>
              <div className="pl-4 space-y-3">
                <p>
                  SEC operates through a tiered participation structure:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Badge Tiers:</span> From Shrimp (entry-level) to Whale (highest-tier), reflecting community contribution and token holdings</li>
                  <li><span className="font-medium">Verification Rights:</span> Earned privileges for report validation based on reputation</li>
                  <li><span className="font-medium">Collaborative Decision Making:</span> Community input on platform development and policy updates</li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Code className="h-4 w-4 text-icc-gold" />
                4. Technical Architecture
              </h4>
              <div className="pl-4 space-y-4">
                <h5 className="font-semibold mb-1">4.1 Front-End Framework</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The SEC platform utilizes a React.js front-end with TypeScript for enhanced type safety and developer ergonomics.
                    Components are organized using a feature-based architecture to ensure maintainable code:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><span className="font-medium">UI Components:</span> Built on Shadcn/UI with Tailwind CSS for responsive design</li>
                    <li><span className="font-medium">State Management:</span> Tanstack React Query for server state management, with contextual hooks for UI state</li>
                    <li><span className="font-medium">Routing:</span> React Router v6 with protected routes enforcing wallet authentication</li>
                    <li><span className="font-medium">Authentication Flow:</span> Secure wallet-based authentication with transaction signing verification</li>
                  </ul>
                </div>

                <h5 className="font-semibold mb-1">4.2 Database Schema</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The platform is built on a PostgreSQL database with the following core entities:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h6 className="font-semibold mb-1">scammers</h6>
                      <ul className="list-none pl-2 space-y-1">
                        <li>id: text (PK)</li>
                        <li>name: text</li>
                        <li>photo_url: text</li>
                        <li>accused_of: text</li>
                        <li>wallet_addresses: text[]</li>
                        <li>links: text[]</li>
                        <li>aliases: text[]</li>
                        <li>accomplices: text[]</li>
                        <li>bounty_amount: numeric</li>
                        <li>date_added: timestamp</li>
                        <li>added_by: text (FK)</li>
                        <li>views/likes/dislikes: integer</li>
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h6 className="font-semibold mb-1">profiles</h6>
                      <ul className="list-none pl-2 space-y-1">
                        <li>id: uuid (PK)</li>
                        <li>wallet_address: text (unique)</li>
                        <li>display_name: text</li>
                        <li>username: text</li>
                        <li>profile_pic_url: text</li>
                        <li>sec_balance: numeric</li>
                        <li>points: integer</li>
                        <li>bio: text</li>
                        <li>x_link/website_link: text</li>
                        <li>created_at: timestamp</li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h6 className="font-semibold mb-1">bounty_contributions</h6>
                      <ul className="list-none pl-2 space-y-1">
                        <li>id: uuid (PK)</li>
                        <li>scammer_id: text (FK)</li>
                        <li>contributor_id: text (FK)</li>
                        <li>contributor_name: text</li>
                        <li>amount: numeric</li>
                        <li>transaction_signature: text</li>
                        <li>comment: text</li>
                        <li>created_at: timestamp</li>
                        <li>transferred_from/to_id: uuid</li>
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h6 className="font-semibold mb-1">user_scammer_interactions</h6>
                      <ul className="list-none pl-2 space-y-1">
                        <li>id: uuid (PK)</li>
                        <li>user_id: text (FK)</li>
                        <li>scammer_id: text (FK)</li>
                        <li>liked: boolean</li>
                        <li>disliked: boolean</li>
                        <li>last_updated: timestamp</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h5 className="font-semibold mb-1">4.3 Blockchain Integration</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The SEC platform integrates with the Solana blockchain through:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><span className="font-medium">Wallet Adapter:</span> Integration with Phantom wallet through <code>@solana/web3.js</code> library</li>
                    <li><span className="font-medium">Token Operations:</span> SEC token tracking using <code>@solana/spl-token</code> for badge tier verification</li>
                    <li><span className="font-medium">Transaction Processing:</span> Validation of bounty contributions on-chain with secure signature verification</li>
                    <li><span className="font-medium">Error Handling:</span> Robust error management for blockchain operations with retry mechanisms</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Database className="h-4 w-4 text-icc-gold" />
                5. Data Management & Services
              </h4>
              <div className="pl-4 space-y-4">
                <h5 className="font-semibold mb-1">5.1 Service Architecture</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The SEC application employs a service-based architecture to separate concerns:
                  </p>
                  <div className="bg-muted/30 p-3 rounded-lg text-xs">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <div>
                        <h6 className="font-semibold">Core Services</h6>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>profileService.ts</li>
                          <li>scammerService.ts</li>
                          <li>reportService.ts</li>
                          <li>commentService.ts</li>
                          <li>bountyService.ts</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-semibold">Supporting Services</h6>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>interactionService.ts</li>
                          <li>notificationService.ts</li>
                          <li>analyticsService.ts</li>
                          <li>loggingService.ts</li>
                          <li>statisticsService.ts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs">
                    Each service implements specific functionality with database operations, error handling, and business logic isolation. 
                    Services communicate with the UI layer through React Query hooks, providing optimistic updates and cache invalidation.
                  </p>
                </div>

                <h5 className="font-semibold mb-1">5.2 Database Access Layer</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The platform uses Supabase for database access, with the following implementation specifics:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><span className="font-medium">Client Configuration:</span> Singleton Supabase client with connection pooling and retry logic</li>
                    <li><span className="font-medium">Row Level Security:</span> Granular RLS policies enforcing data access controls</li>
                    <li><span className="font-medium">Database Functions:</span> PostgreSQL functions for complex operations including:
                      <ul className="list-disc pl-5 pt-1">
                        <li>increment_scammer_views(scammer_id)</li>
                        <li>is_duplicate_view(p_scammer_id, p_ip_hash)</li>
                        <li>update_leaderboard_stats(wallet_address)</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Storage Integration:</span> Secure file storage for profile pictures and evidence uploads</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Lock className="h-4 w-4 text-icc-gold" />
                6. Security Implementation
              </h4>
              <div className="pl-4 space-y-4">
                <h5 className="font-semibold mb-1">6.1 Authentication & Authorization</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The SEC platform implements a wallet-based authentication system with the following components:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><span className="font-medium">Challenge-Response:</span> Secure challenge-response mechanism for wallet verification</li>
                    <li><span className="font-medium">Message Signing:</span> Cryptographic signing of messages to prove wallet ownership</li>
                    <li><span className="font-medium">Session Management:</span> Secure session handling with automatic refresh mechanisms</li>
                    <li><span className="font-medium">Permission Controls:</span> Role-based access control tied to badge tiers</li>
                  </ul>
                </div>

                <h5 className="font-semibold mb-1">6.2 Data Protection</h5>
                <div className="pl-4 space-y-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li><span className="font-medium">Input Validation:</span> Comprehensive validation using Zod schema validation</li>
                    <li><span className="font-medium">XSS Prevention:</span> Content sanitization for user-generated content</li>
                    <li><span className="font-medium">Rate Limiting:</span> IP-based rate limiting for sensitive operations</li>
                    <li><span className="font-medium">Audit Logging:</span> Comprehensive activity tracking for security monitoring</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Cpu className="h-4 w-4 text-icc-gold" />
                7. UI Component Architecture
              </h4>
              <div className="pl-4 space-y-4">
                <div className="pl-4 space-y-2">
                  <p>
                    The UI is built on a modular component architecture with the following structure:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mt-2">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h6 className="font-semibold mb-1">Core Components</h6>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>ScammerCard</li>
                        <li>ScammerDetail</li>
                        <li>ProfileView</li>
                        <li>ReportForm</li>
                        <li>BountyForm</li>
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h6 className="font-semibold mb-1">Layout Components</h6>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Layout</li>
                        <li>Header</li>
                        <li>Footer</li>
                        <li>Hero/CompactHero</li>
                        <li>Sidebar</li>
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h6 className="font-semibold mb-1">Common Components</h6>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Dialog components</li>
                        <li>Form elements</li>
                        <li>LoadingSpinner</li>
                        <li>ErrorBoundary</li>
                        <li>Notifications</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs mt-2">
                    Component composition follows atomic design principles, with base UI components from Shadcn/UI extended with application-specific logic.
                    State is managed through React's Context API for global state and local state hooks for component-specific state.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <GitMerge className="h-4 w-4 text-icc-gold" />
                8. Performance Optimizations
              </h4>
              <div className="pl-4 space-y-4">
                <div className="pl-4 space-y-2">
                  <p>
                    The SEC platform implements the following performance optimization strategies:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><span className="font-medium">Code Splitting:</span> Dynamic imports for route-based code splitting</li>
                    <li><span className="font-medium">Virtualized Lists:</span> Efficient rendering of large data sets through virtualization</li>
                    <li><span className="font-medium">Memoization:</span> Strategic use of React.memo and useMemo to prevent unnecessary renders</li>
                    <li><span className="font-medium">Image Optimization:</span> Responsive images with lazy loading and WebP format</li>
                    <li><span className="font-medium">Query Caching:</span> Tanstack Query's caching and stale-while-revalidate strategy</li>
                    <li><span className="font-medium">Database Indexing:</span> Strategic indexes on frequently queried columns</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Network className="h-4 w-4 text-icc-gold" />
                9. API & Integration Specifications
              </h4>
              <div className="pl-4 space-y-4">
                <h5 className="font-semibold mb-1">9.1 Internal API Design</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The SEC platform uses a RESTful API design with the following endpoints structure:
                  </p>
                  <div className="bg-muted/30 p-3 rounded-lg text-xs">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <div>
                        <h6 className="font-semibold">/scammers</h6>
                        <ul className="list-none pl-3 space-y-1">
                          <li><span className="font-mono text-green-600">GET</span> /scammers</li>
                          <li><span className="font-mono text-green-600">GET</span> /scammers/{'{id}'}</li>
                          <li><span className="font-mono text-blue-600">POST</span> /scammers</li>
                          <li><span className="font-mono text-orange-600">PATCH</span> /scammers/{'{id}'}</li>
                          <li><span className="font-mono text-red-600">DELETE</span> /scammers/{'{id}'}</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-semibold">/profiles</h6>
                        <ul className="list-none pl-3 space-y-1">
                          <li><span className="font-mono text-green-600">GET</span> /profiles/{'{wallet}'}</li>
                          <li><span className="font-mono text-blue-600">POST</span> /profiles</li>
                          <li><span className="font-mono text-orange-600">PATCH</span> /profiles/{'{id}'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <h5 className="font-semibold mb-1">9.2 External Integrations</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The platform interfaces with the following external systems:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><span className="font-medium">Solana RPC:</span> High-availability Solana node for blockchain interactions</li>
                    <li><span className="font-medium">Webhook System:</span> Extensible webhook architecture for notifications and integrations</li>
                    <li><span className="font-medium">Data Export API:</span> Structured data export for research and analysis</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Globe className="h-4 w-4 text-icc-gold" />
                10. Future Technical Roadmap
              </h4>
              <div className="pl-4 space-y-3">
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Decentralized Governance:</span> Implementation of on-chain DAO voting mechanisms</li>
                  <li><span className="font-medium">AI-Enhanced Detection:</span> Machine learning models for pattern recognition in scam reports</li>
                  <li><span className="font-medium">Cross-Chain Monitoring:</span> Expansion to additional blockchain networks beyond Solana</li>
                  <li><span className="font-medium">Real-Time Alerting:</span> WebSocket-based notification system for immediate threat detection</li>
                  <li><span className="font-medium">Developer API:</span> Public API for third-party integrations and ecosystem expansion</li>
                </ul>
              </div>
            </section>
            
            <div className="mt-8 text-center text-xs text-muted-foreground">
              © 2025 Scams & E-crimes Commission | Technical Whitepaper v1.0 - April 2025
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral" className="text-icc-blue hover:bg-gray-100">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};

export default AboutDialog;
