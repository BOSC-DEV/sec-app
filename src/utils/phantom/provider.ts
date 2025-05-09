
import { toast } from '@/hooks/use-toast';
import { PhantomProvider, WindowWithPhantom } from './types';
import { supabase } from '@/integrations/supabase/client';

export const getPhantomProvider = (): PhantomProvider | null => {
  const windowWithPhantom = window as WindowWithPhantom;
  
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
    
    window.open("https://phantom.app/", "_blank");
    return null;
  }
  
  try {
    console.log("Attempting to connect to Phantom wallet...");
    const response = await provider.connect({ onlyIfTrusted: false });
    const publicKey = response.publicKey.toString();
    
    console.log("Phantom wallet connected successfully:", publicKey);
    
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
      console.log("Disconnecting from Phantom wallet...");
      await provider.disconnect();
      
      console.log("Phantom wallet disconnected successfully");
      
      // Also sign out from Supabase
      await supabase.auth.signOut();
      
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

export const signMessageWithPhantom = async (message: string): Promise<string | null> => {
  const provider = getPhantomProvider();
  
  if (!provider || !provider.publicKey) {
    toast({
      title: "Wallet not connected",
      description: "Please connect your Phantom wallet first",
      variant: "destructive",
    });
    return null;
  }
  
  try {
    console.log("Signing message with Phantom wallet...");
    const encodedMessage = new TextEncoder().encode(message);
    const { signature } = await provider.signMessage(encodedMessage);
    
    const signatureBase64 = btoa(String.fromCharCode(...signature));
    console.log("Message signed successfully:", signatureBase64);
    
    return signatureBase64;
  } catch (error) {
    console.error("Error signing message with Phantom wallet:", error);
    toast({
      title: "Signing error",
      description: "Failed to sign message with Phantom wallet",
      variant: "destructive",
    });
    return null;
  }
};
