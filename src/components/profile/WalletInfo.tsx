
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, Copy, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WalletInfo = () => {
  const { walletAddress, disconnectWallet } = useProfile();

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

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
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
              Connected wallet details
            </CardDescription>
          </div>
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
                <Button variant="outline" size="icon" onClick={openSolanaExplorer} title="View on Solana Explorer">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Network</div>
                <div className="font-medium">
                  Solana Mainnet
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Wallet Type</div>
                <div className="font-medium">
                  Solana Wallet
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full border-icc-red text-icc-red hover:bg-icc-red-light/10 hover:text-icc-red flex items-center justify-center gap-2"
                onClick={handleDisconnect}
              >
                <LogOut className="h-4 w-4" /> Disconnect Wallet
              </Button>
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
