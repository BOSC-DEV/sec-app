
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DisclaimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DisclaimerDialog: React.FC<DisclaimerDialogProps> = ({
  open,
  onOpenChange
}) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gothic text-icc-blue">Disclaimer</DialogTitle>
          <DialogDescription>
            Please read this disclaimer carefully before using our platform.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-lg">1. Informational Purposes Only</h3>
            <p>
              The Scams and E-Crimes Commission (SEC) platform is provided for informational purposes only. 
              The information contained on this platform does not constitute legal, financial, or investment advice. 
              We do not guarantee the accuracy, completeness, or reliability of any information presented.
            </p>
            
            <h3 className="font-bold text-lg">2. NGO</h3>
            <p>
              SEC is not affiliated with, endorsed by, or connected to any governmental or law enforcement agency. 
              We are a community-based platform that allows users to report suspected fraudulent activities. 
              Any resemblance to official government entities is coincidental.
            </p>
            
            <h3 className="font-bold text-lg">3. Cryptocurrency Specific Disclaimers</h3>
            <p>
              3.1. <span className="font-semibold">High Risk:</span> Cryptocurrencies and digital assets are highly volatile and speculative. 
              The value of cryptocurrencies can drastically fluctuate and potentially drop to zero. Never invest funds that you cannot afford to lose.
            </p>
            <p>
              3.2. <span className="font-semibold">Regulatory Uncertainty:</span> The regulatory status of cryptocurrencies varies by jurisdiction and is subject to change. 
              Users are responsible for understanding and complying with all applicable laws in their jurisdiction.
            </p>
            <p>
              3.3. <span className="font-semibold">Tax Implications:</span> Cryptocurrency transactions may have tax consequences. 
              Users should consult with qualified tax professionals regarding potential tax liabilities.
            </p>
            <p>
              3.4. <span className="font-semibold">Security Risks:</span> Cryptocurrency transactions are generally irreversible. 
              Loss of private keys, phishing attacks, and exchange hacks can result in permanent loss of funds. 
              Users are solely responsible for securing their digital assets.
            </p>
            
            <h3 className="font-bold text-lg">4. No Solicitation</h3>
            <p>
              Nothing on this platform constitutes an offer to sell, a solicitation of an offer to buy, 
              or a recommendation of any cryptocurrency, digital asset, security, or any other product or service.
            </p>
            
            <h3 className="font-bold text-lg">5. User Conduct</h3>
            <p>
              Users are solely responsible for their actions on the platform. Reports of suspected scammers should be based on 
              factual information and evidence. False accusations may lead to legal consequences for the reporting user. 
              We reserve the right to remove any content that we deem inappropriate, false, or potentially defamatory.
            </p>
            
            <h3 className="font-bold text-lg">6. Legal Recourse</h3>
            <p>
              If you believe you have been a victim of fraud or other criminal activity, you should contact appropriate 
              law enforcement agencies. This platform does not replace proper legal channels for reporting crimes or seeking justice.
            </p>
            
            <h3 className="font-bold text-lg">7. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by applicable law, SEC, its affiliates, directors, employees, and agents 
              shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including 
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your access to or use of or inability to access or use the platform;</li>
              <li>Any conduct or content of any third party on the platform;</li>
              <li>Any content obtained from the platform; and</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
            </ul>
            
            <h3 className="font-bold text-lg">8. Indemnification</h3>
            <p>
              You agree to defend, indemnify, and hold harmless SEC, its affiliates, directors, employees, and agents 
              from and against any claims, liabilities, damages, losses, and expenses, including without limitation, 
              reasonable attorney's fees and costs, arising out of or in any way connected with your access to or use of the platform.
            </p>
            
            <h3 className="font-bold text-lg">9. Modifications</h3>
            <p>
              We reserve the right to modify this disclaimer at any time without prior notice. 
              Your continued use of the platform following any changes indicates your acceptance of the revised disclaimer.
            </p>
            
            <h3 className="font-bold text-lg">10. Governing Law</h3>
            <p>
              This disclaimer shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which SEC is registered, without regard to its conflict of law provisions.
            </p>
            
            <p className="mt-6 font-semibold">
              By using this platform, you acknowledge that you have read, understood, and agree to be bound by this disclaimer.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>;
};

export default DisclaimerDialog;
