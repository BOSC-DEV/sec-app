
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

interface PrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyDialog: React.FC<PrivacyDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue">Privacy Policy</DialogTitle>
          <DialogDescription>
            This policy explains how we collect, use, and protect your information.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-lg">1. Information We Collect</h3>
            <p>
              The Scams & E-crimes Commission (SEC) collects the following types of information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Wallet Address:</span> When you connect your wallet to our platform</li>
              <li><span className="font-semibold">Profile Information:</span> Such as display names and usernames</li>
              <li><span className="font-semibold">Report Content:</span> Information you provide when reporting suspected scammers</li>
              <li><span className="font-semibold">Interaction Data:</span> Information about how you interact with our platform</li>
              <li><span className="font-semibold">Technical Data:</span> IP addresses, browser information, device information</li>
            </ul>
            
            <h3 className="font-bold text-lg">2. How We Use Your Information</h3>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain our platform</li>
              <li>To process and display reports of suspected scammers</li>
              <li>To verify user identity via wallet connections</li>
              <li>To improve and optimize our platform</li>
              <li>To communicate with users about platform updates</li>
              <li>To prevent fraudulent activity on our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
            
            <h3 className="font-bold text-lg">3. Information Sharing and Disclosure</h3>
            <p>
              3.1. <span className="font-semibold">Public Information:</span> Reports submitted to our platform are publicly visible, including the reporter's username and the details of the report.
            </p>
            <p>
              3.2. <span className="font-semibold">Service Providers:</span> We may share information with third-party service providers who perform services on our behalf.
            </p>
            <p>
              3.3. <span className="font-semibold">Legal Requirements:</span> We may disclose information if required by law or in response to valid requests by public authorities.
            </p>
            <p>
              3.4. <span className="font-semibold">Business Transfers:</span> In the event of a merger, acquisition, or asset sale, user information may be transferred as a business asset.
            </p>
            
            <h3 className="font-bold text-lg">4. Blockchain Data</h3>
            <p>
              4.1. <span className="font-semibold">Public Nature:</span> Please be aware that blockchain transactions are publicly recorded. While we protect information stored on our servers, wallet addresses and transactions on the blockchain are public.
            </p>
            <p>
              4.2. <span className="font-semibold">Smart Contracts:</span> Interactions with any smart contracts associated with our platform are recorded on the blockchain and are publicly accessible.
            </p>
            
            <h3 className="font-bold text-lg">5. Data Security</h3>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
            
            <h3 className="font-bold text-lg">6. User Rights</h3>
            <p>
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Right to access personal information we hold about you</li>
              <li>Right to rectify inaccurate personal information</li>
              <li>Right to erasure of your personal information</li>
              <li>Right to restrict or object to processing of your personal information</li>
              <li>Right to data portability</li>
            </ul>
            <p>
              To exercise these rights, please contact us at gov@sec.digital.
            </p>
            
            <h3 className="font-bold text-lg">7. Retention of Information</h3>
            <p>
              We retain user information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            
            <h3 className="font-bold text-lg">8. Children's Privacy</h3>
            <p>
              Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn we have collected personal information from a child, we will delete that information.
            </p>
            
            <h3 className="font-bold text-lg">9. Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h3 className="font-bold text-lg">10. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at gov@sec.digital.
            </p>
            
            <p className="mt-6 font-semibold">
              Last Updated: April 3, 2025
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

export default PrivacyDialog;
