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
                1. Core Reporting System
              </h4>
              <div className="pl-4 space-y-3">
                <p>
                  The reporting system is built on a structured validation framework that ensures accuracy and reliability:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Report Creation:</span> Reports are submitted with mandatory fields including scammer name, wallet addresses, and fraud methodology. The system validates:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Wallet address format validation using regex patterns for multiple blockchain formats</li>
                      <li>Duplicate detection across existing scammer records</li>
                      <li>Evidence requirements including transaction proofs and communication records</li>
                    </ul>
                  </li>
                  <li><span className="font-medium">Validation Process:</span> Reports undergo multi-stage verification:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Initial automated checks for completeness and format validity</li>
                      <li>Cross-referencing against known scam patterns</li>
                      <li>Community validation through the reputation system</li>
                      <li>Final verification by high-reputation members</li>
                    </ul>
                  </li>
                  <li><span className="font-medium">Evidence Storage:</span> The system employs secure storage for:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Transaction screenshots with metadata extraction</li>
                      <li>Communication logs with timestamp verification</li>
                      <li>Wallet activity tracking across multiple chains</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <ChartBar className="h-4 w-4 text-icc-gold" />
                2. Bounty System Architecture
              </h4>
              <div className="pl-4 space-y-4">
                <h5 className="font-semibold mb-1">2.1 Core Bounty Mechanics</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The bounty system operates on a sophisticated transfer and tracking mechanism:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Contribution Logic:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Direct contributions in $SEC tokens</li>
                        <li>Automatic verification of transaction signatures</li>
                        <li>Real-time bounty amount updates with atomic database operations</li>
                        <li>Contribution tracking per user with full history</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Transfer Mechanism:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Partial bounty transfers between scammer reports</li>
                        <li>Mandatory 10% retention on original scammer report</li>
                        <li>Multi-step validation process for transfers</li>
                        <li>Atomic database updates to prevent inconsistencies</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Transaction Validation:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>On-chain verification of $SEC token transfers</li>
                        <li>Double-entry accounting system for bounty tracking</li>
                        <li>Automatic reconciliation of bounty amounts</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <h5 className="font-semibold mb-1">2.2 Contribution Management</h5>
                <div className="pl-4 space-y-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Transfer Rules:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Maximum transfer amount = 90% of original contribution</li>
                        <li>Minimum retention amount = 10% of original contribution</li>
                        <li>Transfer window = unlimited time period</li>
                        <li>Multiple transfers allowed from single contribution</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">State Management:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Active/inactive contribution tracking</li>
                        <li>Transfer history with full audit trail</li>
                        <li>Contribution source tracking</li>
                        <li>Real-time balance updates</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Users className="h-4 w-4 text-icc-gold" />
                3. Leaderboard & Ranking System
              </h4>
              <div className="pl-4 space-y-4">
                <h5 className="font-semibold mb-1">3.1 Scoring Algorithm</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The leaderboard system utilizes a comprehensive scoring algorithm that considers multiple factors:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Point Calculation:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Report Creation: Base 100 points per verified report</li>
                        <li>Report Quality Multiplier: 1.0-2.0x based on detail level</li>
                        <li>Evidence Bonus: +50 points per verified evidence piece</li>
                        <li>Community Validation: +10 points per validation</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Engagement Metrics:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Comment quality score: 1-5 points per substantive comment</li>
                        <li>Like/dislike ratio impact: ±2 points per interaction</li>
                        <li>Report view count: 0.1 points per unique view</li>
                        <li>Cross-references: 5 points per valid connection</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Bounty Impact:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Contribution points: 1 point per $SEC contributed</li>
                        <li>Transfer bonus: 0.5 points per successful transfer</li>
                        <li>Total bounty raised: 2 points per $SEC on reports</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <h5 className="font-semibold mb-1">3.2 Ranking Categories</h5>
                <div className="pl-4 space-y-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Overall Ranking:</span> Combines all metrics with weighted importance:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Report Quality: 40% weight</li>
                        <li>Community Engagement: 30% weight</li>
                        <li>Bounty Activity: 30% weight</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Category Rankings:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Top Reporters: Based on report count and quality</li>
                        <li>Top Contributors: Based on bounty amounts</li>
                        <li>Community Leaders: Based on engagement metrics</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Temporal Rankings:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Daily: Reset every 24 hours</li>
                        <li>Weekly: Rolling 7-day window</li>
                        <li>Monthly: Calendar month basis</li>
                        <li>All-time: Cumulative stats</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Network className="h-4 w-4 text-icc-gold" />
                4. Most Wanted System
              </h4>
              <div className="pl-4 space-y-4">
                <h5 className="font-semibold mb-1">4.1 Ranking Algorithm</h5>
                <div className="pl-4 space-y-2">
                  <p>
                    The Most Wanted list is determined by a complex algorithm that weighs multiple factors:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Primary Metrics:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Total bounty amount (40% weight)</li>
                        <li>Number of verified victims (25% weight)</li>
                        <li>Scam severity score (20% weight)</li>
                        <li>Activity recency (15% weight)</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Severity Scoring:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Financial impact: 1-100 based on total amount</li>
                        <li>Victim count multiplier: 1.0-2.0x</li>
                        <li>Sophistication level: 1-50 points</li>
                        <li>Cross-border factor: 1.5x multiplier</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Time Decay:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Last activity within 7 days: 1.0x</li>
                        <li>8-30 days: 0.8x</li>
                        <li>31-90 days: 0.6x</li>
                        <li>90+ days: 0.4x</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <h5 className="font-semibold mb-1">4.2 Update Mechanism</h5>
                <div className="pl-4 space-y-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Ranking Updates:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Real-time bounty amount updates</li>
                        <li>Hourly recalculation of ranking positions</li>
                        <li>Daily severity score updates</li>
                        <li>Weekly comprehensive review</li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Trigger Events:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>New bounty contributions</li>
                        <li>Additional victim reports</li>
                        <li>New evidence submissions</li>
                        <li>Cross-reference connections</li>
                      </ul>
                    </li>
                  </ul>
                </div>
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
