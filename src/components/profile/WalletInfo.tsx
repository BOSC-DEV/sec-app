
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, Copy, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WalletInfoProps {
  walletAddress?: string | null;
  isOwnProfile?: boolean;
}

const WalletInfo: React.FC<WalletInfoProps> = ({
  walletAddress,
  isOwnProfile = false
}) => {
  const {
    disconnectWallet
  } = useProfile();

  const copyWalletAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: 'Copied',
        description: 'Wallet address copied to clipboard'
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
      description: 'Your wallet has been disconnected'
    });
  };

  const formatWalletAddress = (address: string) => {
    if (address.length > 12) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    return address;
  };

  return (
    <Card className="w-full dark:border-gray-700">
      <CardContent>
        {walletAddress ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400 px-0 my-[20px]">Wallet Address</div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded flex-1 font-mono text-sm truncate">
                  {walletAddress}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={copyWalletAddress} 
                  title="Copy address"
                  className="dark:border-gray-700 dark:text-gray-300"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={openSolanaExplorer} 
                  title="View on Solana Explorer"
                  className="dark:border-gray-700 dark:text-gray-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isOwnProfile && (
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-icc-red text-icc-red hover:bg-icc-red-light/10 hover:text-icc-red dark:border-red-700 dark:text-red-500 dark:hover:bg-red-900/20 flex items-center justify-center gap-2" 
                  onClick={handleDisconnect}
                >
                  <LogOut className="h-4 w-4" /> Disconnect Wallet
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No wallet connected
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletInfo;
