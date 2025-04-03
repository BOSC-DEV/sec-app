
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

interface SafetyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SafetyDialog: React.FC<SafetyDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue">Safety Guidelines</DialogTitle>
          <DialogDescription>
            Important safety practices for cryptocurrency users and reporters.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-lg">1. Protecting Your Digital Assets</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Use Hardware Wallets:</span> For significant holdings, consider using hardware wallets that keep your private keys offline.</li>
              <li><span className="font-semibold">Backup Your Seed Phrases:</span> Always backup your wallet recovery phrases and store them securely offline in multiple locations.</li>
              <li><span className="font-semibold">Never Share Private Keys:</span> Under no circumstances should you share your private keys or seed phrases with anyone.</li>
              <li><span className="font-semibold">Use Strong Passwords:</span> Implement unique, complex passwords for exchange accounts and wallet software.</li>
              <li><span className="font-semibold">Enable 2FA:</span> Always enable two-factor authentication where available, preferably using an authenticator app rather than SMS.</li>
            </ul>
            
            <h3 className="font-bold text-lg">2. Recognizing Common Scams</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Impersonation Scams:</span> Scammers often impersonate well-known figures, companies, or support staff. Verify identity through official channels.</li>
              <li><span className="font-semibold">Giveaway Scams:</span> Be skeptical of any promotion asking you to send cryptocurrency with a promise to send back more.</li>
              <li><span className="font-semibold">Phishing Attacks:</span> Always check URLs carefully and access websites directly rather than through links in emails or messages.</li>
              <li><span className="font-semibold">Fake ICOs/Token Sales:</span> Research thoroughly before investing in any new cryptocurrency project.</li>
              <li><span className="font-semibold">Investment Schemes:</span> Be wary of projects promising guaranteed returns or unusually high yields.</li>
            </ul>
            
            <h3 className="font-bold text-lg">3. Due Diligence Before Investing</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Research the Team:</span> Verify the identities and backgrounds of project team members.</li>
              <li><span className="font-semibold">Examine the Whitepaper:</span> Read the project's whitepaper critically and look for clear use cases and technical details.</li>
              <li><span className="font-semibold">Code Verification:</span> For open-source projects, check if the code is publicly available and has been audited.</li>
              <li><span className="font-semibold">Community Assessment:</span> Evaluate the project's community engagement and transparency.</li>
              <li><span className="font-semibold">Tokenomics Analysis:</span> Understand the token distribution, vesting schedules, and economic model.</li>
            </ul>
            
            <h3 className="font-bold text-lg">4. Safe Reporting Practices</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Verify Before Reporting:</span> Ensure you have sufficient evidence before reporting someone as a scammer.</li>
              <li><span className="font-semibold">Protection of Personal Information:</span> Avoid including your own sensitive information in reports.</li>
              <li><span className="font-semibold">Factual Reporting:</span> Base your reports on verifiable facts rather than speculation or emotions.</li>
              <li><span className="font-semibold">Evidence Collection:</span> Document all interactions with suspected scammers, including screenshots, transaction IDs, and communication logs.</li>
              <li><span className="font-semibold">Legal Reporting:</span> Remember that reporting on our platform does not replace reporting to appropriate legal authorities.</li>
            </ul>
            
            <h3 className="font-bold text-lg">5. Platform Usage Safety</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Connect Wisely:</span> Only connect your wallet to our platform when necessary and disconnect when not in use.</li>
              <li><span className="font-semibold">Transaction Verification:</span> Always verify transaction details before signing or approving any blockchain transaction.</li>
              <li><span className="font-semibold">Privacy Awareness:</span> Remember that blockchain transactions are public. Consider privacy implications before conducting transactions.</li>
              <li><span className="font-semibold">Responsible Engagement:</span> Engage in respectful discussion and avoid sharing personal identifiable information in public forums.</li>
            </ul>
            
            <h3 className="font-bold text-lg">6. Legal Considerations</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Defamation Awareness:</span> Ensure that your reports are truthful and based on facts to avoid potential defamation claims.</li>
              <li><span className="font-semibold">Law Enforcement Cooperation:</span> For serious fraud, report to appropriate legal authorities in addition to our platform.</li>
              <li><span className="font-semibold">Jurisdictional Issues:</span> Be aware that cryptocurrency scams often cross international boundaries, complicating legal recourse.</li>
            </ul>
            
            <h3 className="font-bold text-lg">7. Recovering from Scams</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Immediate Action:</span> If you believe you've been scammed, immediately secure your accounts and stop any further payments.</li>
              <li><span className="font-semibold">Documentation:</span> Document all evidence related to the scam for reporting purposes.</li>
              <li><span className="font-semibold">Reporting:</span> Report the incident to local law enforcement, relevant financial authorities, and cryptocurrency exchanges involved.</li>
              <li><span className="font-semibold">Community Support:</span> Seek support from cryptocurrency communities, which may provide guidance and sometimes assistance in tracking stolen funds.</li>
            </ul>
            
            <p className="mt-6 font-semibold">
              Remember that staying informed is your best defense against scams. Regularly update yourself on the latest security practices and scam techniques in the cryptocurrency space.
            </p>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-icc-blue hover:bg-icc-blue-dark">I Understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SafetyDialog;
