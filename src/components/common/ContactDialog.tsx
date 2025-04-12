import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, AlertTriangle, Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onOpenChange
}) => {
  const {
    toast
  } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("gov@sec.digital").then(() => {
      setCopied(true);
      toast({
        title: "Email copied",
        description: "Email address copied to clipboard",
        duration: 2000
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy email: ', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy email address",
        variant: "destructive",
        duration: 2000
      });
    });
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-icc-blue">Contact Us</DialogTitle>
          <DialogDescription>
            How to reach the Scams & E-crimes Commission team.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[45vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="text-center my-6">
              <h3 className="font-bold text-lg mb-2">General Inquiries</h3>
              <button onClick={handleCopyEmail} aria-label="Copy email address to clipboard" className="text-xl font-bold flex items-center justify-center mx-auto transition-colors text-zinc-400">
                gov@sec.digital
                {copied ? <Check className="ml-2 h-4 w-4 text-green-500" /> : <Copy className="ml-2 h-4 w-4" />}
              </button>
              <p className="mt-2 text-zinc-600">
                For general questions, partnership opportunities, and other inquiries
              </p>
            </div>
            
            <div className="border border-amber-200 p-4 rounded-lg bg-zinc-50">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  
                  <p className="text-orange-700">
                    For urgent reports involving active fraud or significant financial loss, please also contact your local law enforcement agency. The SEC platform is for informational purposes only and does not replace proper legal channels.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">When to Contact Us</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Platform Issues:</span> Report technical problems or bugs with the website</li>
                <li><span className="font-semibold">Content Concerns:</span> Flag inappropriate content or false reports</li>
                <li><span className="font-semibold">Partnership Opportunities:</span> Discuss potential collaborations or integrations</li>
                <li><span className="font-semibold">Media Inquiries:</span> Request for information or interviews</li>
                <li><span className="font-semibold">Legal Matters:</span> Address legal questions or concerns</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Information to Include</h3>
              <p>
                To help us respond efficiently to your inquiry, please include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>A clear subject line indicating the nature of your message</li>
                <li>Your username on the platform (if applicable)</li>
                <li>Detailed description of your inquiry or issue</li>
                <li>Screenshots or evidence (if reporting a technical issue)</li>
                <li>Your preferred method of communication for our response</li>
              </ul>
            </div>
            
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">Response Time</h3>
              <p>
                We aim to respond to all inquiries within 2-3 business days. However, response times may vary based on the volume of messages and the complexity of your inquiry.
              </p>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};

export default ContactDialog;
