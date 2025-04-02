
import { toast } from '@/hooks/use-toast';

export type PhantomEvent = "connect" | "disconnect";

export interface PhantomProvider {
  connect: ({ onlyIfTrusted }: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: () => void) => void;
  isPhantom: boolean;
  isConnected: boolean;
  publicKey: { toString: () => string } | null;
}

export type WindowWithPhantom = Window & { 
  solana?: PhantomProvider;
  phantom?: {
    solana?: PhantomProvider;
  };
};

export const getPhantomProvider = (): PhantomProvider | null => {
  const windowWithPhantom = window as WindowWithPhantom;
  
  // Check if Phantom wallet is available
  const provider = windowWithPhantom.solana || windowWithPhantom.phantom?.solana;
  
  if (provider?.isPhantom) {
    return provider;
  }
  
  return null;
};

export const connectPhantomWallet = async (): Promise<string | null> => {
  const provider = getPhantomProvider();
  
  if (!provider) {
    toast({
      title: "Phantom wallet not found",
      description: "Please install Phantom wallet extension first",
      variant: "destructive",
    });
    
    // Open Phantom website in a new tab
    window.open("https://phantom.app/", "_blank");
    return null;
  }
  
  try {
    const response = await provider.connect({ onlyIfTrusted: false });
    const publicKey = response.publicKey.toString();
    
    toast({
      title: "Wallet connected",
      description: "Phantom wallet connected successfully",
    });
    
    return publicKey;
  } catch (error) {
    console.error("Error connecting to Phantom wallet:", error);
    toast({
      title: "Connection error",
      description: "Failed to connect to Phantom wallet",
      variant: "destructive",
    });
    return null;
  }
};

export const disconnectPhantomWallet = async (): Promise<void> => {
  const provider = getPhantomProvider();
  
  if (provider) {
    try {
      await provider.disconnect();
      toast({
        title: "Wallet disconnected",
        description: "Phantom wallet disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting from Phantom wallet:", error);
      toast({
        title: "Disconnection error",
        description: "Failed to disconnect from Phantom wallet",
        variant: "destructive",
      });
    }
  }
};

export const getWalletPublicKey = (): string | null => {
  const provider = getPhantomProvider();
  
  if (provider && provider.isConnected && provider.publicKey) {
    return provider.publicKey.toString();
  }
  
  return null;
};

export const isPhantomInstalled = (): boolean => {
  return getPhantomProvider() !== null;
};
