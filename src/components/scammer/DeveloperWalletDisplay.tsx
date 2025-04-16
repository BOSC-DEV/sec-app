import React from 'react';
import { Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CurrencyIcon from '@/components/common/CurrencyIcon';
interface DeveloperWalletDisplayProps {
  developerWalletAddress: string;
}
const DeveloperWalletDisplay: React.FC<DeveloperWalletDisplayProps> = ({
  developerWalletAddress
}) => {
  const {
    toast
  } = useToast();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(developerWalletAddress).then(() => {
      toast({
        title: "Copied",
        description: "Wallet address copied to clipboard"
      });
    });
  };

  // Format the wallet address for display
  const shortAddress = `${developerWalletAddress.substring(0, 4)}...${developerWalletAddress.substring(developerWalletAddress.length - 4)}`;
  return <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm font-medium text-icc-blue dark:text-white my-[5px]">Multi-Sig Treasury</div>
        
      </div>
      <div className="bg-icc-gold-light/30 border border-icc-gold/30 rounded p-3 flex items-center justify-between">
        <span className="font-mono text-sm text-icc-blue-dark dark:text-white">{shortAddress}</span>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-icc-gold-dark hover:text-icc-blue hover:bg-icc-gold-light/50" onClick={copyToClipboard} aria-label="Copy wallet address">
          <Clipboard className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>;
};
export default DeveloperWalletDisplay;