
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
interface CookieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const CookieDialog: React.FC<CookieDialogProps> = ({
  open,
  onOpenChange
}) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gothic text-icc-blue">Cookie Policy</DialogTitle>
          <DialogDescription>
            This policy explains how we use cookies and similar technologies.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <h3 className="font-bold text-lg">1. What Are Cookies</h3>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
            
            <h3 className="font-bold text-lg">2. How We Use Cookies</h3>
            <p>
              The Scams & E-crimes Commission (SEC) platform uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Essential Cookies:</span> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account authentication.</li>
              <li><span className="font-semibold">Functionality Cookies:</span> These cookies allow us to remember choices you make and provide enhanced, more personal features.</li>
              <li><span className="font-semibold">Analytics Cookies:</span> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
              <li><span className="font-semibold">Performance Cookies:</span> These cookies collect information about how you use our website, such as which pages you visit most often.</li>
            </ul>
            
            <h3 className="font-bold text-lg">3. Web3 and Local Storage</h3>
            <p>
              In addition to traditional cookies, we also use:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold">Local Storage:</span> We use browser local storage to store certain preferences and data to improve your experience.</li>
              <li><span className="font-semibold">Web3 Connection Data:</span> When you connect your cryptocurrency wallet, certain connection data may be stored to maintain your session.</li>
            </ul>
            
            <h3 className="font-bold text-lg">4. Third-Party Cookies</h3>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We use third-party cookies for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Analytics and performance measurement</li>
              <li>Integration with blockchain and wallet services</li>
              <li>Security and fraud prevention</li>
            </ul>
            
            <h3 className="font-bold text-lg">5. Cookie Management</h3>
            <p>
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our site and some services and functionalities may not work.
            </p>
            <p>
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="http://www.aboutcookies.org" className="text-icc-blue underline">www.aboutcookies.org</a> or <a href="http://www.allaboutcookies.org" className="text-icc-blue underline">www.allaboutcookies.org</a>.
            </p>
            
            <h3 className="font-bold text-lg">6. Web3 and Wallet Connections</h3>
            <p>
              When connecting your cryptocurrency wallet to our platform, you may be asked to approve the connection through your wallet interface. This establishes a connection between your wallet and our platform but does not give us control over your wallet or private keys.
            </p>
            
            <h3 className="font-bold text-lg">7. Changes to Our Cookie Policy</h3>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page with an updated revision date.
            </p>
            
            <h3 className="font-bold text-lg">8. Contact Us</h3>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at gov@sec.digital.
            </p>
            
            <p className="mt-6 font-semibold">
              Last Updated: April 3, 2025
            </p>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="neutral">I Understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default CookieDialog;
