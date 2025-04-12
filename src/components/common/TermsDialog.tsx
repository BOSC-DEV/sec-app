
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const TermsDialog: React.FC<TermsDialogProps> = ({
  open,
  onOpenChange
}) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue">Terms of Service</DialogTitle>
          <DialogDescription>
            Please read these terms carefully before using our platform.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-lg">1. Acceptance of Terms</h3>
            <p>
              By accessing or using the Scams & E-crimes Commission (SEC) platform, you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the platform.
            </p>
            
            <h3 className="font-bold text-lg">2. Description of Service</h3>
            <p>
              SEC provides a community-driven platform for reporting and tracking suspected fraudulent activities, particularly in the cryptocurrency space. 
              The platform allows users to submit reports, view reports submitted by others, and contribute to a collective database of potential scammers.
            </p>
            
            <h3 className="font-bold text-lg">3. User Registration and Accounts</h3>
            <p>
              3.1. <span className="font-semibold">Wallet Authentication:</span> To access certain features of the platform, users must connect a supported cryptocurrency wallet. 
              This serves as your authentication method and profile identifier.
            </p>
            <p>
              3.2. <span className="font-semibold">Account Responsibility:</span> You are responsible for maintaining the security of your wallet and for all activities that occur under your account.
            </p>
            <p>
              3.3. <span className="font-semibold">Account Restrictions:</span> We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior.
            </p>
            
            <h3 className="font-bold text-lg">4. User Conduct</h3>
            <p>
              4.1. <span className="font-semibold">Accurate Information:</span> Users must provide accurate and truthful information when submitting reports or other content.
            </p>
            <p>
              4.2. <span className="font-semibold">Prohibited Activities:</span> Users may not:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Submit false reports or information with malicious intent</li>
              <li>Impersonate any person or entity</li>
              <li>Submit content that is defamatory, harassing, abusive, or otherwise harmful</li>
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to manipulate rankings or metrics</li>
              <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
            </ul>
            
            <h3 className="font-bold text-lg">5. Content Submission</h3>
            <p>
              5.1. <span className="font-semibold">User Responsibility:</span> You are solely responsible for any content you submit to the platform.
            </p>
            <p>
              5.2. <span className="font-semibold">Content License:</span> By submitting content, you grant SEC a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and distribute such content.
            </p>
            <p>
              5.3. <span className="font-semibold">Content Removal:</span> SEC reserves the right to remove any content that violates these terms or is otherwise objectionable.
            </p>
            
            <h3 className="font-bold text-lg">6. Intellectual Property</h3>
            <p>
              All content, features, and functionality of the SEC platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, are owned by SEC or its licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h3 className="font-bold text-lg">7. Limitation of Liability</h3>
            <p>
              7.1. <span className="font-semibold">Disclaimer of Warranties:</span> The platform is provided "as is" and "as available" without warranties of any kind, either express or implied.
            </p>
            <p>
              7.2. <span className="font-semibold">Limitation of Damages:</span> To the fullest extent permitted by law, SEC shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
            
            <h3 className="font-bold text-lg">8. Indemnification</h3>
            <p>
              You agree to indemnify and hold harmless SEC, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the platform.
            </p>
            
            <h3 className="font-bold text-lg">9. Modifications to Terms</h3>
            <p>
              SEC reserves the right to modify these terms at any time. We will provide notice of significant changes by posting the new terms on the platform. Your continued use of the platform after such changes constitutes your acceptance of the new terms.
            </p>
            
            <h3 className="font-bold text-lg">10. Governing Law</h3>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SEC is registered, without regard to its conflict of law provisions.
            </p>
            
            <h3 className="font-bold text-lg">11. Dispute Resolution</h3>
            <p>
              Any dispute arising from or relating to these terms or the platform shall be resolved through arbitration in accordance with the rules of the jurisdiction in which SEC is registered.
            </p>
            
            <h3 className="font-bold text-lg">12. Severability</h3>
            <p>
              If any provision of these terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced.
            </p>
            
            <h3 className="font-bold text-lg">13. Entire Agreement</h3>
            <p>
              These terms constitute the entire agreement between you and SEC regarding the use of the platform, superseding any prior agreements.
            </p>
            
            <p className="mt-6 font-semibold">
              By using this platform, you acknowledge that you have read, understood, and agree to be bound by these terms of service.
            </p>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button className="bg-neutral-50">I Agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default TermsDialog;
