import React, { FC, ReactNode, useMemo, useCallback } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletError } from '@solana/wallet-adapter-base';
import { Commitment } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

// Solana RPC configuration
const TRANSACTION_TIMEOUT = 90 * 1000;

const getEndpoint = (): string => {
  return import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
};

const connectionConfig = {
  commitment: 'confirmed' as Commitment,
  confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
  disableRetryOnRateLimit: false,
};

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const endpoint = useMemo(() => getEndpoint(), []);

  // Configure wallets - these are auto-detected if installed
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  );

  // Handle wallet errors
  const onError = useCallback((error: WalletError) => {
    console.error('Wallet error:', error);
    
    // Don't show toast for user rejection
    if (error.name === 'WalletNotReadyError') {
      toast({
        title: 'Wallet Not Ready',
        description: 'Please unlock your wallet and try again.',
        variant: 'destructive',
      });
    } else if (error.name === 'WalletConnectionError') {
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to wallet. Please try again.',
        variant: 'destructive',
      });
    } else if (error.name !== 'WalletSignMessageError' && 
               error.name !== 'WalletSignTransactionError' &&
               !error.message?.includes('User rejected')) {
      toast({
        title: 'Wallet Error',
        description: error.message || 'An unexpected wallet error occurred.',
        variant: 'destructive',
      });
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint} config={connectionConfig}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
