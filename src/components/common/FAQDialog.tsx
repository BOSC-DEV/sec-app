
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

interface FAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FAQDialog: React.FC<FAQDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue">Frequently Asked Questions</DialogTitle>
          <DialogDescription>
            Find answers to common questions about the Scams & E-crimes Commission.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-bold text-lg">1. What is the Scams & E-crimes Commission (SEC)?</h3>
              <p>
                The SEC is a community-driven platform designed to identify, report, and track cryptocurrency fraudsters and scammers. We provide a decentralized registry to bring accountability to the digital space and help protect users from fraud.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">2. Is the SEC affiliated with any government organization?</h3>
              <p>
                No, the SEC is not affiliated with, endorsed by, or connected to any governmental or law enforcement agency. We are an independent, community-based platform that allows users to report and track suspected fraudulent activities.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">3. How do I report a scammer?</h3>
              <p>
                To report a scammer, you need to:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Connect your wallet to our platform</li>
                <li>Navigate to the "Report" section</li>
                <li>Fill out the reporting form with as much detail as possible</li>
                <li>Provide evidence supporting your report</li>
                <li>Submit your report for community review</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">4. What kinds of evidence should I include in a report?</h3>
              <p>
                Effective evidence includes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Screenshots of communications</li>
                <li>Blockchain transaction IDs</li>
                <li>Website URLs and social media profiles</li>
                <li>Wallet addresses associated with the scammer</li>
                <li>Description of the scam methodology</li>
                <li>Timestamps and dates of interactions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">5. Why do I need to connect a wallet to use the platform?</h3>
              <p>
                Wallet connection serves multiple purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provides a secure method of authentication</li>
                <li>Prevents spam and fraudulent reports</li>
                <li>Enables reputation building within the platform</li>
                <li>Allows for potential future token-based governance</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">6. What happens after I submit a report?</h3>
              <p>
                After submission, your report is:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Published on the platform with your username as the reporter</li>
                <li>Available for community review and verification</li>
                <li>Potentially added to the Most Wanted list if it receives sufficient verification</li>
                <li>Permanently stored in our database for future reference</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">7. What is the Most Wanted list?</h3>
              <p>
                The Most Wanted list highlights scammers who have been reported multiple times or who have allegedly committed large-scale fraud. These profiles receive more visibility to warn the wider community about potential threats.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">8. How does the bounty system work?</h3>
              <p>
                Our bounty system allows users to place monetary rewards on confirmed scammers. These bounties incentivize the community to provide additional evidence and information that could lead to accountability or recovery of funds.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">9. Can I be anonymous when reporting?</h3>
              <p>
                While your wallet address is required for authentication, you can create a pseudonymous username and profile. We do not require your real name or personal information, but keep in mind that wallet addresses are publicly viewable on the blockchain.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">10. What if I'm falsely reported as a scammer?</h3>
              <p>
                If you believe you've been falsely reported:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>You can create an account and respond to the allegations</li>
                <li>Provide evidence countering the claims</li>
                <li>Request a review from the community</li>
                <li>Contact us directly at gov@sec.digital for serious cases</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">11. Is the information on the platform legally admissible?</h3>
              <p>
                Our platform is for informational purposes only. While the information may be useful for identifying patterns of fraud, it may not meet legal standards for evidence in all jurisdictions. Always consult with legal authorities for formal proceedings.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">12. How can I improve my reputation on the platform?</h3>
              <p>
                You can build reputation by:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Submitting well-documented, factual reports</li>
                <li>Having your reports verified by the community</li>
                <li>Contributing constructively to discussions</li>
                <li>Helping to verify or provide additional evidence for existing reports</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">13. Can I report scams that occurred outside of cryptocurrency?</h3>
              <p>
                While our primary focus is on cryptocurrency-related scams, you can report other digital and electronic crimes. However, reports should have some connection to digital assets, online platforms, or electronic communications.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">14. How does the platform prevent misuse or false reporting?</h3>
              <p>
                We employ several measures:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Requiring wallet authentication to prevent anonymous false reports</li>
                <li>Community verification processes</li>
                <li>Evidence requirements for all reports</li>
                <li>Reputation systems for reporters</li>
                <li>Moderation for clearly false or malicious content</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg">15. Who is behind the SEC platform?</h3>
              <p>
                The SEC was created by a team of cryptocurrency enthusiasts, security experts, and developers concerned about the prevalence of scams in the digital asset space. Our mission is to create a safer ecosystem through community-driven accountability.
              </p>
            </div>
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

export default FAQDialog;
