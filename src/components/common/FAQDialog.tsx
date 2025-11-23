
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  HelpCircle, 
  UserCheck, 
  Globe, 
  FileText, 
  Search, 
  Wallet, 
  CheckCircle, 
  List, 
  DollarSign, 
  UserCircle, 
  AlertTriangle, 
  Scale, 
  TrendingUp, 
  BadgeHelp, 
  Shield 
} from 'lucide-react';

interface FAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FAQDialog: React.FC<FAQDialogProps> = ({
  open,
  onOpenChange
}) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gothic text-icc-blue flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Frequently Asked Questions
          </DialogTitle>
          <DialogDescription>
            Find answers to common questions about the Scams and E-Crimes Commission.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p className="font-medium">Last Updated: April 2025</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-icc-blue" />
                1. What is the Scams and E-Crimes Commission (SEC)?
              </h3>
              <p>
                The SEC is a community-driven platform designed to identify, report, and track cryptocurrency fraudsters and scammers. We provide a decentralized registry to bring accountability to the digital space and help protect users from fraud.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-icc-blue" />
                2. Is the SEC affiliated with any government organization?
              </h3>
              <p>
                No, the SEC is not affiliated with, endorsed by, or connected to any governmental or law enforcement agency. We are an independent, community-based platform that allows users to report and track suspected fraudulent activities.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-icc-blue" />
                3. How do I report a scammer?
              </h3>
              <p>
                To report a scammer, you need to:
              </p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Connect your wallet to our platform</li>
                <li>Navigate to the "Report" section</li>
                <li>Fill out the reporting form with as much detail as possible</li>
                <li>Provide evidence supporting your report</li>
                <li>Submit your report for community review</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-icc-blue" />
                4. What kinds of evidence should I include in a report?
              </h3>
              <p>
                Effective evidence includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Screenshots of communications</li>
                <li>Blockchain transaction IDs</li>
                <li>Website URLs and social media profiles</li>
                <li>Wallet addresses associated with the scammer</li>
                <li>Description of the scam methodology</li>
                <li>Timestamps and dates of interactions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-icc-blue" />
                5. Why do I need to connect a wallet to use the platform?
              </h3>
              <p>
                Wallet connection serves multiple purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Provides a secure method of authentication</li>
                <li>Prevents spam and fraudulent reports</li>
                <li>Enables reputation building within the platform</li>
                <li>Allows for potential future token-based governance</li>
                <li>Facilitates bounty contributions and withdrawals</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-icc-blue" />
                6. What happens after I submit a report?
              </h3>
              <p>
                After submission, your report is:
              </p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Published on the platform with your username as the reporter</li>
                <li>Available for community review and verification</li>
                <li>Potentially added to the Most Wanted list if it receives sufficient verification</li>
                <li>Permanently stored in our database for future reference</li>
                <li>Possibly eligible for bounty placements by other users</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <List className="h-5 w-5 text-icc-blue" />
                7. What is the Most Wanted list?
              </h3>
              <p>
                The Most Wanted list highlights scammers who have been reported multiple times or who have allegedly committed large-scale fraud. These profiles receive more visibility to warn the wider community about potential threats. As of April 2025, profiles on this list have a combined reported fraud value of over $150 million.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-icc-blue" />
                8. How does the bounty system work?
              </h3>
              <p>
                Our bounty system allows users to place monetary rewards on confirmed scammers. These bounties incentivize the community to provide additional evidence and information that could lead to accountability or recovery of funds. The 2025 update includes multi-chain bounty support and automated verification for bounty claims.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-icc-blue" />
                9. Can I be anonymous when reporting?
              </h3>
              <p>
                While your wallet address is required for authentication, you can create a pseudonymous username and profile. We do not require your real name or personal information, but keep in mind that wallet addresses are publicly viewable on the blockchain. Our enhanced privacy features (added in 2025) provide additional protection for whistleblowers.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-icc-blue" />
                10. What if I'm falsely reported as a scammer?
              </h3>
              <p>
                If you believe you've been falsely reported:
              </p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>You can create an account and respond to the allegations</li>
                <li>Provide evidence countering the claims</li>
                <li>Request a review from the community</li>
                <li>Utilize our new dispute resolution system (introduced in 2025)</li>
                <li>Contact us directly at gov@sec.digital for serious cases</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-icc-blue" />
                11. Is the information on the platform legally admissible?
              </h3>
              <p>
                Our platform is for informational purposes only. While the information may be useful for identifying patterns of fraud, it may not meet legal standards for evidence in all jurisdictions. However, our 2025 evidence certification system now creates standardized reports that have been accepted by courts in several jurisdictions. Always consult with legal authorities for formal proceedings.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-icc-blue" />
                12. How can I improve my reputation on the platform?
              </h3>
              <p>
                You can build reputation by:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Submitting well-documented, factual reports</li>
                <li>Having your reports verified by the community</li>
                <li>Contributing constructively to discussions</li>
                <li>Helping to verify or provide additional evidence for existing reports</li>
                <li>Participating in the new reputation staking system (launched Q1 2025)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BadgeHelp className="h-5 w-5 text-icc-blue" />
                13. Are there any new features in 2025?
              </h3>
              <p>
                Yes, we've introduced several new features in 2025:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><span className="font-semibold">Advanced AI Scam Detection:</span> Machine learning tools to identify potential scams</li>
                <li><span className="font-semibold">Cross-Chain Monitoring:</span> Expanded tracking across multiple blockchain networks</li>
                <li><span className="font-semibold">Mobile Alerts:</span> Real-time notifications for high-risk scam activities</li>
                <li><span className="font-semibold">Enhanced Recovery Tools:</span> Resources for victims seeking to recover funds</li>
                <li><span className="font-semibold">Educational Hub:</span> Comprehensive learning resources about crypto safety</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-icc-blue" />
                14. How does the platform prevent misuse or false reporting?
              </h3>
              <p>
                We employ several measures:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Requiring wallet authentication to prevent anonymous false reports</li>
                <li>Community verification processes with multi-stage validation</li>
                <li>Evidence requirements for all reports with standardized evaluation</li>
                <li>Reputation systems for reporters with stake-based accountability</li>
                <li>AI-assisted moderation for clearly false or malicious content</li>
                <li>Dispute resolution system with independent reviewers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-icc-blue" />
                15. How can I contribute to the SEC beyond reporting?
              </h3>
              <p>
                There are multiple ways to contribute:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Participate in community verification of reports</li>
                <li>Contribute to bounties on confirmed scammers</li>
                <li>Help develop educational content for the platform</li>
                <li>Participate in governance discussions and proposals</li>
                <li>Spread awareness about crypto safety in your networks</li>
                <li>Join our developer community to improve platform tools</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>;
};

export default FAQDialog;
