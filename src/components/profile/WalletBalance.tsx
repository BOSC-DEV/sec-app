
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

// Import from phantomWallet utility
import { getConnection } from '@/utils/phantomWallet';

// SEC token mint address
const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

interface WalletBalanceProps {
  walletAddress?: string | null;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ walletAddress }) => {
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [secBalance, setSecBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSolBalance = async (address: string) => {
    try {
      const connection = getConnection();
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return 0;
    }
  };

  const fetchSecBalance = async (address: string) => {
    try {
      const connection = getConnection();
      const publicKey = new PublicKey(address);
      
      // Get the associated token account address
      const tokenAccountAddress = await getAssociatedTokenAddress(
        SEC_TOKEN_MINT,
        publicKey
      );
      
      try {
        // Get the token account info
        const tokenAccount = await getAccount(connection, tokenAccountAddress);
        
        // Convert amount (BigInt) to human-readable format with 6 decimals
        const balance = Number(tokenAccount.amount) / Math.pow(10, 6);
        return balance;
      } catch (error) {
        // Token account might not exist yet
        console.log('Token account not found, likely zero balance');
        return 0;
      }
    } catch (error) {
      console.error('Error fetching SEC balance:', error);
      return 0;
    }
  };

  const fetchBalances = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    try {
      const solBal = await fetchSolBalance(walletAddress);
      setSolBalance(solBal);
      
      const secBal = await fetchSecBalance(walletAddress);
      setSecBalance(secBal);
    } catch (error) {
      console.error('Error fetching balances:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch wallet balances',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchBalances();
    }
  }, [walletAddress]);

  const handleRefresh = () => {
    fetchBalances();
    toast({
      title: 'Refreshing',
      description: 'Updating wallet balances...',
    });
  };

  const formatBalance = (balance: number | null): string => {
    if (balance === null) return '-';
    return balance.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Wallet Balances
            </CardTitle>
            <CardDescription>
              Current token balances
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {walletAddress ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SOL Balance */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">SOL Balance</div>
                {isLoading ? (
                  <Skeleton className="h-7 w-24" />
                ) : (
                  <div className="font-mono text-xl font-bold text-blue-700">
                    {formatBalance(solBalance)} <span className="text-xs font-normal">SOL</span>
                  </div>
                )}
              </div>

              {/* SEC Balance */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">SEC Balance</div>
                {isLoading ? (
                  <Skeleton className="h-7 w-24" />
                ) : (
                  <div className="font-mono text-xl font-bold text-amber-700">
                    {formatBalance(secBalance)} <span className="text-xs font-normal">SEC</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="h-3 w-3" />
                {isLoading ? 'Refreshing...' : 'Refresh Balances'}
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

export default WalletBalance;
