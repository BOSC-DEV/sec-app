
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue">About the Scams & E-crimes Commission</DialogTitle>
          <DialogDescription>
            Our mission, vision, and approach to combating digital fraud.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <h3 className="font-bold text-lg text-center">Whitepaper: Decentralized Crime Registry</h3>
            
            <h4 className="font-bold">Executive Summary</h4>
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
            
            <h4 className="font-bold">4. Verification System</h4>
            <p>
              4.1 <span className="font-semibold">Multi-tiered Verification</span>
            </p>
            <p>
              Reports progress through verification levels based on:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Corroboration from multiple independent reporters</li>
              <li>Quality and quantity of evidence provided</li>
              <li>Reputation of reporting users</li>
              <li>On-chain verification where applicable</li>
            </ul>
            <p>
              4.2 <span className="font-semibold">Confidence Scoring</span>
            </p>
            <p>
              Each report receives a dynamic confidence score that reflects the current level of verification. This score helps users assess the reliability of the information when making decisions about potential interactions with the reported entity.
            </p>
            
            <h4 className="font-bold">5. Incentive Mechanisms</h4>
            <p>
              5.1 <span className="font-semibold">Bounty System</span>
            </p>
            <p>
              Users can place bounties on confirmed scammers, creating financial incentives for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Additional evidence collection</li>
              <li>Identification of previously unknown information</li>
              <li>Tracking of assets across blockchain networks</li>
              <li>Recovery of stolen funds</li>
            </ul>
            <p>
              5.2 <span className="font-semibold">Reputation Rewards</span>
            </p>
            <p>
              Contributors build reputation within the platform by:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Submitting verified reports</li>
              <li>Contributing valuable evidence to existing reports</li>
              <li>Participating in verification processes</li>
              <li>Providing accurate and helpful information</li>
            </ul>
            
            <h4 className="font-bold">6. Governance</h4>
            <p>
              6.1 <span className="font-semibold">Community Oversight</span>
            </p>
            <p>
              The platform governance follows a distributed model where community members with established reputation can participate in:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Content moderation decisions</li>
              <li>Feature prioritization</li>
              <li>Policy development</li>
              <li>Dispute resolution</li>
            </ul>
            <p>
              6.2 <span className="font-semibold">Transparency Principles</span>
            </p>
            <p>
              All governance decisions, moderation actions, and platform changes are documented and accessible to users, ensuring accountability and building trust in the system.
            </p>
            
            <h4 className="font-bold">7. Privacy and Ethics</h4>
            <p>
              7.1 <span className="font-semibold">Responsible Reporting</span>
            </p>
            <p>
              The platform implements safeguards against misuse:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Anti-doxxing policies that prohibit sharing personal information</li>
              <li>Focus on evidence-based reporting rather than speculation</li>
              <li>Clear guidelines for appropriate content</li>
              <li>Mechanisms for contesting false reports</li>
            </ul>
            <p>
              7.2 <span className="font-semibold">Data Protection</span>
            </p>
            <p>
              While maintaining transparency of reported fraud, the platform protects:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Personal information of reporters</li>
              <li>Sensitive details of victims</li>
              <li>Information that could enable further exploitation</li>
            </ul>
            
            <h4 className="font-bold">8. Future Development</h4>
            <p>
              8.1 <span className="font-semibold">Ecosystem Integration</span>
            </p>
            <p>
              The SEC platform aims to develop APIs and integrations that allow:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cryptocurrency wallets to display warnings about reported addresses</li>
              <li>Exchanges to incorporate risk assessment into their compliance systems</li>
              <li>DeFi protocols to utilize scam data in smart contract interactions</li>
              <li>Browser extensions to provide real-time warnings about reported websites</li>
            </ul>
            <p>
              8.2 <span className="font-semibold">Machine Learning Applications</span>
            </p>
            <p>
              As the database of reports grows, machine learning algorithms will be developed to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Identify patterns in scam methodologies</li>
              <li>Detect potential fraud before victims are affected</li>
              <li>Enhance the efficiency of verification processes</li>
              <li>Generate risk profiles for suspicious activities</li>
            </ul>
            
            <h4 className="font-bold">9. Conclusion</h4>
            <p>
              The Scams & E-crimes Commission represents a new paradigm in combating digital fraud through community-driven accountability. By harnessing collective intelligence, creating the right incentive structures, and building a robust reputation system, the SEC aims to significantly reduce the prevalence and impact of cryptocurrency scams while establishing a model for self-governance in the digital asset ecosystem.
            </p>
            
            <p className="mt-6 text-center font-semibold">
              © 2025 Scams & E-crimes Commission
            </p>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-icc-blue hover:bg-icc-blue-dark">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
