
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Globe, BookOpen, ChartBar, Users, Shield, Trophy, Target } from 'lucide-react';

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
            Whitepaper v1.0 - April 2025
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
                <Target className="h-4 w-4 text-icc-gold" />
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
                <Shield className="h-4 w-4 text-icc-gold" />
                3. Security & Verification
              </h4>
              <div className="pl-4 space-y-3">
                <p>
                  The SEC platform employs a robust security framework:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Wallet Authentication:</span> Secure user identification through blockchain wallet integration</li>
                  <li><span className="font-medium">Evidence Standards:</span> Strict requirements for verifiable proof in scam reports</li>
                  <li><span className="font-medium">Community Validation:</span> Decentralized verification process leveraging collective intelligence</li>
                  <li><span className="font-medium">Data Protection:</span> Encrypted storage and privacy-preserving reporting mechanisms</li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Users className="h-4 w-4 text-icc-gold" />
                4. Community Governance
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
                <Trophy className="h-4 w-4 text-icc-gold" />
                5. Platform Achievements
              </h4>
              <div className="pl-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-bold text-2xl text-icc-gold">5,000+</p>
                    <p className="text-sm">Scams Identified</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-bold text-2xl text-icc-gold">$12M+</p>
                    <p className="text-sm">Assets Recovered</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-bold text-2xl text-icc-gold">$30M+</p>
                    <p className="text-sm">Losses Prevented</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-bold text-2xl text-icc-gold">250K+</p>
                    <p className="text-sm">Users Protected</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-bold flex items-center gap-2 text-base mb-3">
                <Globe className="h-4 w-4 text-icc-gold" />
                6. Future Development
              </h4>
              <div className="pl-4 space-y-3">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Implementation of fully decentralized governance structure</li>
                  <li>Enhanced AI-powered scam detection systems</li>
                  <li>Mobile applications for real-time alerts</li>
                  <li>Expanded cross-chain monitoring capabilities</li>
                  <li>International partnerships with cybersecurity agencies</li>
                </ul>
              </div>
            </section>
            
            <div className="mt-8 text-center text-xs text-muted-foreground">
              © 2025 Scams & E-crimes Commission | Version 1.0 - April 2025
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

