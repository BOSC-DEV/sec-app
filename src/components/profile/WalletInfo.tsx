
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, LogOut, Medal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getDelegatedBadges } from '@/services/badgeDelegationService';
import { Link } from 'react-router-dom';

interface WalletInfoProps {
  walletAddress?: string | null;
  isOwnProfile?: boolean;
  secBalance?: number | null;
}

const WalletInfo: React.FC<WalletInfoProps> = ({
  walletAddress,
  isOwnProfile = false,
  secBalance = null
}) => {
  const {
    disconnectWallet
  } = useProfile();
  const navigate = useNavigate();
  const [delegationInfo, setDelegationInfo] = useState<{
    delegator_wallet: string; 
    delegator_username?: string;
    display_name?: string;
  } | null>(null);

  useEffect(() => {
    const loadDelegationInfo = async () => {
      if (!walletAddress) {
        setDelegationInfo(null);
        return;
      }
      
      try {
        const delegations = await getDelegatedBadges(walletAddress);
        // Find if this wallet is delegated a badge from someone
        const delegation = delegations.find(d => d.delegated_wallet === walletAddress && d.active);
        
        if (delegation) {
          console.log('Found active delegation:', delegation);
          setDelegationInfo({
            delegator_wallet: delegation.delegator_wallet,
            delegator_username: delegation.delegator_username,
            display_name: delegation.display_name
          });
        } else {
          // Clear delegation info if no active delegation is found
          console.log('No active delegation found for wallet:', walletAddress);
          setDelegationInfo(null);
        }
      } catch (error) {
        console.error('Error loading delegation info:', error);
        // On error, clear delegation info to avoid showing stale data
        setDelegationInfo(null);
      }
    };
    
    loadDelegationInfo();
    
    // Set up a refresh interval to check for delegation changes
    const intervalId = setInterval(loadDelegationInfo, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
  }, [walletAddress]);

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
    navigate('/');
  };

  return <Card className="w-full dark:border-gray-700">
      <CardContent>
        {walletAddress ? <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400 px-0 mt-[20px]">Address</div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded flex-1 font-mono text-sm truncate">
                  {walletAddress}
                </div>
                <Button variant="outline" size="icon" onClick={copyWalletAddress} title="Copy address" className="dark:border-gray-700 dark:text-gray-300">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={openSolanaExplorer} title="View on Solana Explorer" className="dark:border-gray-700 dark:text-gray-300">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {delegationInfo && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <Medal className="h-4 w-4 text-icc-gold" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Badge delegated by{' '}
                    {delegationInfo.delegator_username ? (
                      <Link 
                        to={`/${delegationInfo.delegator_username}`} 
                        className="font-medium text-icc-blue hover:text-icc-blue-light dark:text-icc-gold dark:hover:text-icc-gold-light"
                      >
                        {delegationInfo.display_name || delegationInfo.delegator_username}
                      </Link>
                    ) : (
                      <span className="font-medium">{delegationInfo.delegator_wallet.substring(0, 6)}...{delegationInfo.delegator_wallet.substring(delegationInfo.delegator_wallet.length - 4)}</span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {isOwnProfile && <div className="pt-4">
                <Button variant="outline" className="w-full border-icc-red text-icc-red hover:bg-icc-red-light/10 hover:text-icc-red dark:border-red-700 dark:text-red-500 dark:hover:bg-red-900/20 flex items-center justify-center gap-2" onClick={handleDisconnect}>
                  <LogOut className="h-4 w-4" /> Disconnect Wallet
                </Button>
              </div>}
          </div> : <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No wallet connected
          </div>}
      </CardContent>
    </Card>;
};

export default WalletInfo;
