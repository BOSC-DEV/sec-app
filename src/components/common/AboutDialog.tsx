
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Globe, BookOpen } from 'lucide-react';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({
  open,
  onOpenChange
}) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            About the Scams & E-crimes Commission
          </DialogTitle>
          <DialogDescription>
            Our mission, vision, and approach to combating digital fraud.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold text-lg text-center flex items-center justify-center gap-2">
                <BookOpen className="h-5 w-5" />
                SEC: Pioneering Digital Trust Since 2025
              </h3>
            </div>
            
            <h4 className="font-bold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Executive Summary
            </h4>
            <p>
              The Scams & E-crimes Commission (SEC) is a decentralized platform designed to create accountability and self-governance within the digital asset ecosystem. By leveraging community-driven reporting, verification, and incentivization mechanisms, the SEC aims to reduce the prevalence and impact of cryptocurrency scams and electronic crimes.
            </p>
            
            <h4 className="font-bold">1. Introduction</h4>
            <p>
              1.1 <span className="font-semibold">Problem Statement</span>
            </p>
            <p>
              The cryptocurrency and digital asset space has experienced exponential growth, bringing with it an unprecedented increase in fraud, scams, and criminal activity. Traditional law enforcement agencies often lack the resources, technical expertise, or jurisdictional authority to effectively combat these crimes, leaving victims with little recourse and allowing perpetrators to continue operating with impunity.
            </p>
            <p>
              1.2 <span className="font-semibold">Solution Overview</span>
            </p>
            <p>
              The SEC provides a community-driven platform where users can report, verify, and track suspected scammers. By creating a transparent, immutable record of fraudulent activities, the SEC establishes a reputation system that follows actors across the digital landscape, making it increasingly difficult for bad actors to repeatedly victimize different communities.
            </p>
            
            <h4 className="font-bold">2. Platform Architecture</h4>
            <p>
              2.1 <span className="font-semibold">Technical Foundation</span>
            </p>
            <p>
              The SEC platform is built on a hybrid architecture that combines traditional database systems for scalability and performance with blockchain integration for authentication, verification, and immutability of critical data. This approach allows for a user-friendly experience while maintaining the transparency and trustlessness necessary for a community-governed system.
            </p>
            <p>
              2.2 <span className="font-semibold">Key Components</span>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-semibold">Reporting System:</span> A structured submission process for documenting suspected scammers with evidence.</li>
              <li><span className="font-semibold">Verification Mechanism:</span> A multi-layered approach to validating reports through community consensus.</li>
              <li><span className="font-semibold">Reputation Framework:</span> A system for establishing credibility of both reporters and the accused.</li>
              <li><span className="font-semibold">Incentive Structure:</span> Bounties and rewards to motivate community participation in identifying and documenting scams.</li>
              <li><span className="font-semibold">Identity System:</span> Wallet-based authentication that balances anonymity with accountability.</li>
            </ul>
            
            <h4 className="font-bold">3. Reporting Methodology</h4>
            <p>
              3.1 <span className="font-semibold">Report Submission</span>
            </p>
            <p>
              Users submit reports through a structured form that captures essential information about the suspected scammer and the fraudulent activity. Reports must include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Identifiers (wallet addresses, usernames, websites, etc.)</li>
              <li>Description of the fraudulent activity</li>
              <li>Evidence (screenshots, transaction hashes, communications)</li>
              <li>Timeline of events</li>
              <li>Estimated financial impact</li>
            </ul>
            <p>
              3.2 <span className="font-semibold">Evidence Standards</span>
            </p>
            <p>
              The platform encourages high-quality evidence that is:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verifiable by third parties</li>
              <li>Specific and detailed</li>
              <li>Timestamped and chronological</li>
              <li>Free from personal identifying information of victims</li>
              <li>Factual rather than speculative</li>
            </ul>
            
            <h4 className="font-bold">4. 2025 Platform Enhancements</h4>
            <p>
              As of April 2025, the SEC has implemented significant improvements to our platform:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Enhanced AI Detection:</span> Implementation of advanced machine learning algorithms to proactively identify suspicious patterns typical of scam operations.</li>
              <li><span className="font-semibold">Cross-Chain Monitoring:</span> Expanded capability to track fraudulent activities across multiple blockchain networks.</li>
              <li><span className="font-semibold">Improved Verification Speed:</span> Streamlined community verification process with a 60% reduction in verification time.</li>
              <li><span className="font-semibold">International Partnerships:</span> New collaborations with global cybersecurity agencies and cryptocurrency exchanges.</li>
            </ul>
            
            <h4 className="font-bold">5. Community Impact</h4>
            <p>
              The SEC has demonstrated measurable impact since its inception:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Successful identification of over 5,000 scam operations</li>
              <li>Community bounties leading to the recovery of approximately $12M in stolen assets</li>
              <li>Development of early warning systems that have prevented an estimated $30M in potential losses</li>
              <li>Creation of educational resources that have reached over 250,000 cryptocurrency users</li>
            </ul>
            
            <h4 className="font-bold">6. Future Roadmap (2025-2026)</h4>
            <p>
              The SEC is committed to continuous improvement with these planned initiatives:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-semibold">Decentralized Governance:</span> Implementation of a fully community-governed decision-making process</li>
              <li><span className="font-semibold">Mobile Application:</span> Development of native mobile apps for real-time scam alerts</li>
              <li><span className="font-semibold">Educational Platform:</span> Launch of comprehensive crypto safety courses and certification</li>
              <li><span className="font-semibold">Recovery Assistance Program:</span> Specialized support for victims seeking to recover stolen assets</li>
            </ul>
            
            <p className="mt-6 text-center font-semibold">
              © 2025 Scams & E-crimes Commission | Updated: April 2025
            </p>
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
