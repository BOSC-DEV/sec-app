
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WalletInfo = () => {
  const { walletAddress, isPhantomAvailable } = useProfile();

  const copyWalletAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: 'Copied',
        description: 'Wallet address copied to clipboard',
      });
    }
  };

  const openSolanaExplorer = () => {
    if (walletAddress) {
      window.open(`https://explorer.solana.com/address/${walletAddress}`, '_blank');
    }
  };

  const formatWalletAddress = (address: string) => {
    if (address.length > 12) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    return address;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" /> Wallet Information
            </CardTitle>
            <CardDescription>
              Your connected wallet details
            </CardDescription>
          </div>
          {isPhantomAvailable && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
              Phantom
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {walletAddress ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-1 text-gray-500">Wallet Address</div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded flex-1 font-mono text-sm truncate">
                  {walletAddress}
                </div>
                <Button variant="outline" size="icon" onClick={copyWalletAddress} title="Copy address">
                  <Copy className="h-4 w-4" />
                </Button>
                {isPhantomAvailable && (
                  <Button variant="outline" size="icon" onClick={openSolanaExplorer} title="View on Solana Explorer">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Network</div>
                <div className="font-medium">
                  {isPhantomAvailable ? 'Solana Mainnet' : 'Mock Network'}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Wallet Type</div>
                <div className="font-medium">
                  {isPhantomAvailable ? 'Phantom' : 'Mock Wallet'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No wallet connected
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletInfo;
