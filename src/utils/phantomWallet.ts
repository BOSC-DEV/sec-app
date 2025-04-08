import { toast } from '@/hooks/use-toast';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createTransferInstruction,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
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
  signAndSendTransaction: (transaction: Transaction, options?: any) => Promise<{ signature: string }>;
}

export type WindowWithPhantom = Window & { 
  solana?: PhantomProvider;
  phantom?: {
    solana?: PhantomProvider;
  };
};

const ALCHEMY_RPC_URL = 'https://solana-mainnet.g.alchemy.com/v2/ibmWfrUOabGJ9hN-Ugjtlb5MLdwlWx1d';
const FALLBACK_RPC_URL = 'https://api.mainnet-beta.solana.com';

const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

const connection = new Connection(ALCHEMY_RPC_URL, 'confirmed');

let fallbackConnection: Connection | null = null;

const getConnection = (): Connection => {
  return connection;
};

const getFallbackConnection = (): Connection => {
  if (!fallbackConnection) {
    console.log('Initializing fallback Solana connection');
    fallbackConnection = new Connection(FALLBACK_RPC_URL, 'confirmed');
  }
  return fallbackConnection;
};

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

const getOrCreateAssociatedTokenAccount = async (
  connection: Connection,
  payer: PublicKey,
  owner: PublicKey,
  mint: PublicKey
): Promise<PublicKey> => {
  try {
    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      true
    );
    
    try {
      await getAccount(connection, associatedToken);
      return associatedToken;
    } catch (error) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        console.log(`Associated token account for ${owner.toString()} doesn't exist, creating...`);
        return associatedToken;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in getOrCreateAssociatedTokenAccount:', error);
    throw new Error(`Failed to get associated token account: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

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
    console.log(`Processing SEC token transaction to ${recipientAddress} for ${amount} $SEC tokens...`);
    
    const transaction = new Transaction();
    
    const fromPubkey = new PublicKey(provider.publicKey.toString());
    
    let toPubkey: PublicKey;
    try {
      toPubkey = new PublicKey(recipientAddress);
    } catch (error) {
      toast({
        title: "Invalid recipient address",
        description: "The recipient address is not a valid Solana address",
        variant: "destructive",
      });
      return null;
    }
    
    const activeConnection = getConnection();
    
    try {
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        activeConnection,
        fromPubkey,
        fromPubkey,
        SEC_TOKEN_MINT
      );
      
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        activeConnection,
        fromPubkey,
        toPubkey,
        SEC_TOKEN_MINT
      );
      
      try {
        await getAccount(activeConnection, recipientTokenAccount);
      } catch (error) {
        if (
          error instanceof TokenAccountNotFoundError ||
          error instanceof TokenInvalidAccountOwnerError
        ) {
          console.log("Creating recipient's associated token account...");
          transaction.add(
            createAssociatedTokenAccountInstruction(
              fromPubkey,
              recipientTokenAccount,
              toPubkey,
              SEC_TOKEN_MINT
            )
          );
        } else {
          throw error;
        }
      }
      
      const tokenDecimals = 9;
      const tokenAmount = BigInt(Math.floor(amount * 10 ** tokenDecimals));
      
      transaction.add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          fromPubkey,
          tokenAmount
        )
      );
      
      try {
        const { blockhash } = await activeConnection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;
        
        console.log("Sending SEC token transaction via Alchemy RPC...");
        const { signature } = await provider.signAndSendTransaction(transaction);
        
        console.log("SEC token transaction sent, signature:", signature);
        
        const confirmation = await activeConnection.confirmTransaction(signature, 'confirmed');
        
        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }
        
        console.log("SEC token transaction confirmed successfully");
        
        toast({
          title: "Transaction successful",
          description: `Successfully sent ${amount} $SEC tokens to the wallet`,
        });
        
        return signature;
      } catch (error) {
        console.error("Primary RPC connection failed, trying fallback:", error);
        
        try {
          const fallbackConn = getFallbackConnection();
          
          const { blockhash } = await fallbackConn.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
          
          console.log("Sending SEC token transaction via fallback RPC...");
          const { signature } = await provider.signAndSendTransaction(transaction);
          
          console.log("Fallback SEC token transaction sent, signature:", signature);
          
          const confirmation = await fallbackConn.confirmTransaction(signature, 'confirmed');
          
          if (confirmation.value.err) {
            throw new Error(`Fallback transaction failed: ${JSON.stringify(confirmation.value.err)}`);
          }
          
          console.log("Fallback SEC token transaction confirmed successfully");
          
          toast({
            title: "Transaction successful (fallback)",
            description: `Successfully sent ${amount} $SEC tokens to the wallet`,
          });
          
          return signature;
        } catch (fallbackError) {
          throw new Error(`Both primary and fallback RPC failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error("Error while preparing transaction:", error);
      throw error;
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to process SEC token transaction. Please try again later.",
      severity: ErrorSeverity.HIGH,
      context: "PROCESS_TOKEN_TRANSACTION"
    });
    return null;
  }
};
