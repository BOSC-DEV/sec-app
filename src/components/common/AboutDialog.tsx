
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
              <div className="pl-4 space-y-4">
                <p>
                  The reporting system implements a sophisticated multi-layered architecture designed for accuracy, reliability, and scalability:
                </p>
                <div className="space-y-4">
                  <h5 className="font-semibold">1.1 Data Validation Framework</h5>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Input Validation Layer:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Real-time wallet address validation using blockchain-specific regex patterns:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Ethereum: ^0x[a-fA-F0-9]{40}$</li>
                            <li>Bitcoin: ^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$</li>
                            <li>Solana: [1-9A-HJ-NP-Za-km-z]{32,44}</li>
                          </ul>
                        </li>
                        <li>Dynamic field validation with configurable rules:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Required fields: name, accused_of, wallet_addresses</li>
                            <li>Optional fields: photo_url, aliases, links, accomplices</li>
                            <li>Array field validation: minimum 1 wallet address</li>
                          </ul>
                        </li>
                        <li>Duplicate detection system:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Fuzzy matching on scammer names (Levenshtein distance ≤ 2)</li>
                            <li>Exact matching on wallet addresses</li>
                            <li>Cross-reference against existing aliases</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Evidence Processing Pipeline:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>File validation and processing:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Maximum file size: 10MB per image</li>
                            <li>Supported formats: PNG, JPG, JPEG, WEBP</li>
                            <li>Automatic image optimization and compression</li>
                            <li>EXIF data stripping for privacy</li>
                          </ul>
                        </li>
                        <li>Metadata extraction and verification:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Transaction hash verification</li>
                            <li>Timestamp validation</li>
                            <li>Blockchain explorer integration</li>
                          </ul>
                        </li>
                        <li>Storage and retrieval system:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Content-addressable storage with SHA-256 hashing</li>
                            <li>Redundant storage across multiple availability zones</li>
                            <li>Automatic file type detection and validation</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Report Verification Process:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Multi-stage verification workflow:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Stage 1: Automated checks (syntax, completeness)</li>
                            <li>Stage 2: Duplicate detection and cross-referencing</li>
                            <li>Stage 3: Community validation period (72 hours)</li>
                            <li>Stage 4: High-reputation member review</li>
                          </ul>
                        </li>
                        <li>Verification scoring algorithm:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Base score: 0-100 based on completeness</li>
                            <li>Evidence multiplier: 1.0-2.0x based on quality</li>
                            <li>Community trust factor: 0.5-1.5x based on validation</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <ChartBar className="h-4 w-4 text-icc-gold" />
                2. Bounty System Architecture
              </h4>
              <div className="pl-4 space-y-4">
                <h5 className="font-semibold">2.1 Core Transaction Engine</h5>
                <div className="space-y-2">
                  <p>
                    The bounty system operates on a sophisticated blockchain-integrated architecture:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Transaction Processing Pipeline:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Input validation:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Amount validation (minimum 0.01 $SEC)</li>
                            <li>Signature verification using ed25519</li>
                            <li>Balance checks against user wallet</li>
                          </ul>
                        </li>
                        <li>Transaction execution:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Atomic operations with rollback capability</li>
                            <li>Double-entry accounting system</li>
                            <li>Real-time balance updates</li>
                          </ul>
                        </li>
                        <li>State management:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>ACID compliance for all operations</li>
                            <li>Optimistic locking for concurrent updates</li>
                            <li>Event-driven architecture for notifications</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Transfer Mechanism:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Business rules enforcement:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>90% maximum transfer amount</li>
                            <li>10% minimum retention requirement</li>
                            <li>Multiple transfer support</li>
                          </ul>
                        </li>
                        <li>Transfer validation:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Source contribution verification</li>
                            <li>Destination scammer validation</li>
                            <li>Transfer amount constraints</li>
                          </ul>
                        </li>
                        <li>Transfer execution:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Two-phase commit protocol</li>
                            <li>Automatic balance reconciliation</li>
                            <li>Transfer history tracking</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>

                  <h5 className="font-semibold mt-4">2.2 State Management System</h5>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Contribution State Machine:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>State transitions:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>PENDING → CONFIRMED → ACTIVE</li>
                            <li>ACTIVE → TRANSFERRED (partial/full)</li>
                            <li>ACTIVE → REFUNDED (exceptional cases)</li>
                          </ul>
                        </li>
                        <li>State constraints:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Minimum balance requirements</li>
                            <li>Transfer cooldown periods</li>
                            <li>Maximum transfer attempts</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Balance Management:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Balance tracking:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Real-time balance calculations</li>
                            <li>Historical balance tracking</li>
                            <li>Balance reconciliation system</li>
                          </ul>
                        </li>
                        <li>Transfer restrictions:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Minimum balance enforcement</li>
                            <li>Maximum transfer limits</li>
                            <li>Daily transfer quotas</li>
                          </ul>
                        </li>
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
                <h5 className="font-semibold">3.1 Scoring Algorithm</h5>
                <div className="space-y-2">
                  <p>
                    The leaderboard implements a comprehensive scoring system with multiple weighted factors:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Core Metrics:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Report Quality Score (max 100 points per report):
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Completeness: 0-40 points
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Required fields: 20 points</li>
                                <li>Optional fields: 10 points</li>
                                <li>Evidence quality: 10 points</li>
                              </ul>
                            </li>
                            <li>Verification success: 0-30 points
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Community validation: 15 points</li>
                                <li>Evidence verification: 15 points</li>
                              </ul>
                            </li>
                            <li>Community engagement: 0-30 points
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Comments quality: 10 points</li>
                                <li>Helpful votes: 10 points</li>
                                <li>Report shares: 10 points</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li>Engagement Metrics:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Comment scoring:
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Base points: 1-5 per comment</li>
                                <li>Length multiplier: 1.0-1.5x</li>
                                <li>Quality bonus: 0-3 points</li>
                              </ul>
                            </li>
                            <li>Interaction scoring:
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Likes received: 2 points each</li>
                                <li>Shares generated: 5 points each</li>
                                <li>Report views: 0.1 points each</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li>Bounty Impact:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Contribution scoring:
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Base: 1 point per $SEC</li>
                                <li>Early contributor bonus: 1.5x</li>
                                <li>Large contribution bonus: 2x</li>
                              </ul>
                            </li>
                            <li>Transfer efficiency:
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Successful transfers: 5 points</li>
                                <li>Strategic placement: 10 points</li>
                                <li>Network effect: 2x multiplier</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <h5 className="font-semibold mt-4">3.2 Ranking Categories</h5>
                <div className="space-y-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Overall Ranking Algorithm:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Base Formula:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Total Score = (QS × 0.4) + (ES × 0.3) + (BS × 0.3)</li>
                            <li>QS = Quality Score (normalized 0-100)</li>
                            <li>ES = Engagement Score (normalized 0-100)</li>
                            <li>BS = Bounty Score (normalized 0-100)</li>
                          </ul>
                        </li>
                        <li>Time decay factors:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Recent activity bonus: 1.0-1.5x</li>
                            <li>Historical contribution weight: 0.7-1.0x</li>
                            <li>Seasonal adjustments: ±0.2x</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Specialized Rankings:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Reporter Rankings:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Report accuracy weight: 40%</li>
                            <li>Community validation: 30%</li>
                            <li>Impact measurement: 30%</li>
                          </ul>
                        </li>
                        <li>Contributor Rankings:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Total bounty amount: 50%</li>
                            <li>Transfer efficiency: 25%</li>
                            <li>Strategic impact: 25%</li>
                          </ul>
                        </li>
                        <li>Community Leadership:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Engagement quality: 40%</li>
                            <li>Network influence: 30%</li>
                            <li>Contribution impact: 30%</li>
                          </ul>
                        </li>
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
                <h5 className="font-semibold">4.1 Ranking Algorithm</h5>
                <div className="space-y-2">
                  <p>
                    The Most Wanted list utilizes a sophisticated ranking algorithm that considers multiple weighted factors:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Core Metrics Implementation:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Primary metrics calculation:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Bounty weight (40%):
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Total amount normalization</li>
                                <li>Growth rate factor</li>
                                <li>Contribution diversity</li>
                              </ul>
                            </li>
                            <li>Victim impact (25%):
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Verified victim count</li>
                                <li>Financial impact scale</li>
                                <li>Geographic distribution</li>
                              </ul>
                            </li>
                            <li>Severity score (20%):
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Scam sophistication level</li>
                                <li>Network complexity</li>
                                <li>Recovery difficulty</li>
                              </ul>
                            </li>
                            <li>Activity recency (15%):
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Last reported activity</li>
                                <li>Pattern frequency</li>
                                <li>Temporal clustering</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Severity Scoring Implementation:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Financial impact assessment:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Amount classification:
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Tier 1 (1-10 points): < $10,000</li>
                                <li>Tier 2 (11-30 points): $10,000-$100,000</li>
                                <li>Tier 3 (31-60 points): $100,000-$1M</li>
                                <li>Tier 4 (61-100 points): > $1M</li>
                              </ul>
                            </li>
                            <li>Victim multiplier:
                              <ul className="list-[square] pl-5 mt-1">
                                <li>1-5 victims: 1.0x</li>
                                <li>6-20 victims: 1.3x</li>
                                <li>21-100 victims: 1.6x</li>
                                <li>>100 victims: 2.0x</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li>Sophistication assessment:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Technical complexity:
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Basic (1-10 points)</li>
                                <li>Intermediate (11-25 points)</li>
                                <li>Advanced (26-40 points)</li>
                                <li>Sophisticated (41-50 points)</li>
                              </ul>
                            </li>
                            <li>Network analysis:
                              <ul className="list-[square] pl-5 mt-1">
                                <li>Wallet clustering</li>
                                <li>Transaction patterns</li>
                                <li>Cross-chain activity</li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <h5 className="font-semibold mt-4">4.2 Dynamic Ranking System</h5>
                <div className="space-y-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">Real-time Updates:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Trigger events:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>New bounty contributions</li>
                            <li>Additional victim reports</li>
                            <li>Evidence submissions</li>
                            <li>Cross-reference connections</li>
                          </ul>
                        </li>
                        <li>Update schedule:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Real-time: Bounty amounts</li>
                            <li>Hourly: Position recalculation</li>
                            <li>Daily: Severity assessment</li>
                            <li>Weekly: Comprehensive review</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><span className="font-medium">Position Calculation:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Ranking formula:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Base score calculation</li>
                            <li>Time decay application</li>
                            <li>Activity boost factors</li>
                          </ul>
                        </li>
                        <li>Update triggers:
                          <ul className="list-[circle] pl-5 mt-1">
                            <li>Score threshold changes</li>
                            <li>New evidence impact</li>
                            <li>Community validation</li>
                          </ul>
                        </li>
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

