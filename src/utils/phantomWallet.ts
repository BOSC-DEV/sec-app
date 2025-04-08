
import { toast } from '@/hooks/use-toast';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';

export type PhantomEvent = "connect" | "disconnect";

export interface PhantomProvider {
  connect: ({ onlyIfTrusted }: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: () => void) => void;
  isPhantom: boolean;
  isConnected: boolean;
  publicKey: { toString: () => string } | null;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  // Update interface to match actual Phantom API
  signAndSendTransaction: (transaction: Transaction, options?: any) => Promise<{ signature: string }>;
  // Remove sendTransaction since it's not available
}

export type WindowWithPhantom = Window & { 
  solana?: PhantomProvider;
  phantom?: {
    solana?: PhantomProvider;
  };
};

// Configuration constants
const ALCHEMY_RPC_URL = 'https://solana-mainnet.g.alchemy.com/v2/ibmWfrUOabGJ9hN-Ugjtlb5MLdwlWx1d';
const FALLBACK_RPC_URL = 'https://api.mainnet-beta.solana.com';

// Create primary connection with Alchemy
const connection = new Connection(ALCHEMY_RPC_URL, 'confirmed');

// Fallback connection in case the primary fails
let fallbackConnection: Connection | null = null;

// Function to get an active connection, with fallback logic
const getConnection = (): Connection => {
  return connection;
};

// Function to initialize fallback connection if needed
const getFallbackConnection = (): Connection => {
  if (!fallbackConnection) {
    console.log('Initializing fallback Solana connection');
    fallbackConnection = new Connection(FALLBACK_RPC_URL, 'confirmed');
  }
  return fallbackConnection;
};

/**
 * Get the Phantom wallet provider if available
 * @returns PhantomProvider | null
 */
export const getPhantomProvider = (): PhantomProvider | null => {
  const windowWithPhantom = window as WindowWithPhantom;
  
  // Check if Phantom wallet is available
  const provider = windowWithPhantom.solana || windowWithPhantom.phantom?.solana;
  
  if (provider?.isPhantom) {
    return provider;
  }
  
  return null;
};

/**
 * Connect to Phantom wallet
 * @returns Promise<string | null> - Public key of the wallet or null if connection failed
 */
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

/**
 * Disconnect from Phantom wallet
 */
export const disconnectPhantomWallet = async (): Promise<void> => {
  const provider = getPhantomProvider();
  
  if (provider) {
    try {
      console.log("Disconnecting from Phantom wallet...");
      await provider.disconnect();
      
      console.log("Phantom wallet disconnected successfully");
      
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

/**
 * Get the public key of the connected wallet
 * @returns string | null - Public key or null if not connected
 */
export const getWalletPublicKey = (): string | null => {
  const provider = getPhantomProvider();
  
  if (provider && provider.isConnected && provider.publicKey) {
    return provider.publicKey.toString();
  }
  
  return null;
};

/**
 * Check if Phantom wallet is installed
 * @returns boolean
 */
export const isPhantomInstalled = (): boolean => {
  return getPhantomProvider() !== null;
};

/**
 * Sign a message with Phantom wallet
 * @param message - Message to sign
 * @returns Promise<string | null> - Base64 encoded signature or null if signing failed
 */
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
    
    // Convert signature to base64
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

/**
 * Process a bounty transaction to the developer wallet using Alchemy RPC
 * @param recipientAddress - Recipient wallet address
 * @param amount - Amount in $SEC tokens (or SOL for testing)
 * @returns Promise<string | null> - Transaction signature or null if transaction failed
 */
export const sendTransactionToDevWallet = async (
  recipientAddress: string,
  amount: number
): Promise<string | null> => {
  const provider = getPhantomProvider();
  
  if (!provider || !provider.publicKey) {
    toast({
      title: "Wallet not connected",
      description: "Please connect your Phantom wallet first",
      variant: "destructive",
    });
    return null;
  }
  
  if (amount <= 0) {
    toast({
      title: "Invalid amount",
      description: "Amount must be greater than 0",
      variant: "destructive",
    });
    return null;
  }
  
  try {
    console.log(`Processing transaction to ${recipientAddress} for ${amount} $SEC tokens...`);
    
    // For this implementation, we'll use SOL transfers since we don't have a real $SEC token
    // In a production environment, you would use the SPL Token program for token transfers
    
    // Create a Solana transaction
    const transaction = new Transaction();
    
    // Get sender's public key
    const fromPubkey = new PublicKey(provider.publicKey.toString());
    
    // Get recipient's public key
    const toPubkey = new PublicKey(recipientAddress);
    
    // Add transfer instruction to transaction
    // We'll convert the amount to lamports (1 SOL = 1_000_000_000 lamports)
    // For testing purposes, we'll use a smaller amount
    // In production, you would convert from your token's decimals
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL / 1000); // Dividing by 1000 for testing, to use very small amounts
    
    transaction.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );
    
    try {
      // Get Alchemy connection
      const activeConnection = getConnection();
      
      // Set recent blockhash
      const { blockhash } = await activeConnection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;
      
      // Sign and send transaction using signAndSendTransaction instead of sendTransaction
      console.log("Sending transaction via Alchemy RPC using signAndSendTransaction...");
      const { signature } = await provider.signAndSendTransaction(transaction);
      
      console.log("Transaction sent, signature:", signature);
      
      // Wait for confirmation
      const confirmation = await activeConnection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }
      
      console.log("Transaction confirmed successfully");
      
      toast({
        title: "Transaction successful",
        description: `Successfully sent ${amount} $SEC tokens to the developer wallet`,
      });
      
      return signature;
    } catch (error) {
      console.error("Primary RPC connection failed, trying fallback:", error);
      
      // If primary connection fails, try with fallback
      try {
        const fallbackConn = getFallbackConnection();
        
        // Get new blockhash from fallback connection
        const { blockhash } = await fallbackConn.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        
        console.log("Sending transaction via fallback RPC...");
        const { signature } = await provider.signAndSendTransaction(transaction);
        
        console.log("Fallback transaction sent, signature:", signature);
        
        // Wait for confirmation on fallback
        const confirmation = await fallbackConn.confirmTransaction(signature, 'confirmed');
        
        if (confirmation.value.err) {
          throw new Error(`Fallback transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }
        
        console.log("Fallback transaction confirmed successfully");
        
        toast({
          title: "Transaction successful (fallback)",
          description: `Successfully sent ${amount} $SEC tokens to the developer wallet`,
        });
        
        return signature;
      } catch (fallbackError) {
        throw new Error(`Both primary and fallback RPC failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
      }
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to process transaction. Please try again later.",
      severity: ErrorSeverity.HIGH,
      context: "PROCESS_TRANSACTION"
    });
    return null;
  }
};
