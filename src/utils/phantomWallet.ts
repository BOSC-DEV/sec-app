import { Connection, clusterApiUrl } from '@solana/web3.js';

// Keep connection utilities for blockchain interactions
export const getConnection = (): Connection => {
  const quickNodeUrl = "https://virulent-prettiest-waterfall.solana-mainnet.quiknode.pro/dd8dc0e0413c65ca95b35c8912a146e1caedd35a/";
  return new Connection(quickNodeUrl, 'confirmed');
};

export const getFallbackConnection = (): Connection => {
  return new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
};

// Deprecated functions - Privy handles wallet connections
export const connectPhantomWallet = async (): Promise<string | null> => {
  console.warn('connectPhantomWallet is deprecated - use Privy authentication instead');
  return null;
};

export const disconnectPhantomWallet = (): void => {
  console.warn('disconnectPhantomWallet is deprecated - use Privy authentication instead');
};

export const getPhantomProvider = (): any => {
  console.warn('getPhantomProvider is deprecated - use Privy wallet provider instead');
  return null;
};

export const getWalletPublicKey = (): string | null => {
  console.warn('getWalletPublicKey is deprecated - use Privy wallet context instead');
  return null;
};

export const isPhantomInstalled = (): boolean => {
  console.warn('isPhantomInstalled is deprecated - Privy handles wallet availability');
  return true;
};

export const signMessageWithPhantom = async (message: string): Promise<string | null> => {
  console.warn('signMessageWithPhantom is deprecated - Privy handles message signing');
  return null;
};

export const sendTransactionToDevWallet = async (
  developerWalletAddress: string,
  amount: number
): Promise<string | null> => {
  console.warn('sendTransactionToDevWallet needs to be updated for Privy integration');
  return null;
};
