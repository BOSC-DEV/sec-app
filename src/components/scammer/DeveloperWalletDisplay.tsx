
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';

interface DeveloperWalletDisplayProps {
  developerWalletAddress: string;
}

const DeveloperWalletDisplay = ({ developerWalletAddress }: DeveloperWalletDisplayProps) => {
  const displayWallet = developerWalletAddress ? 
    `${developerWalletAddress.substring(0, 4)}...${developerWalletAddress.substring(developerWalletAddress.length - 4)}` : 
    'Not specified';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Developer wallet address copied!"
      });
    }).catch((error) => {
      handleError(error, {
        fallbackMessage: "Failed to copy to clipboard",
        severity: ErrorSeverity.LOW,
        context: "COPY_WALLET"
      });
    });
  };

  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-icc-blue mb-2">Developer Wallet</div>
      <div className="bg-icc-gold-light/30 border border-icc-gold/30 rounded p-3 flex items-center justify-between">
        <span className="font-mono text-sm text-icc-blue-dark">{displayWallet}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-icc-gold-dark hover:text-icc-blue hover:bg-icc-gold-light/50" 
          onClick={() => copyToClipboard(developerWalletAddress)}
          aria-label="Copy developer wallet address"
        >
          <Clipboard className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default DeveloperWalletDisplay;
