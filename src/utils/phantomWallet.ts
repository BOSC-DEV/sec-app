import { toast } from '@/hooks/use-toast';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionSignature,
  VersionedTransaction,
  Commitment
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';

export type PhantomEvent = "connect" | "disconnect";

export interface PhantomProvider {
  connect: ({ onlyIfTrusted }: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: () => void) => void;
  off: (event: PhantomEvent, callback: () => void) => void;
  isPhantom: boolean;
  isConnected: boolean;
  publicKey: { toString: () => string } | null;
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signAllTransactions: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signAndSendTransaction: (transaction: Transaction | VersionedTransaction, options?: any) => Promise<{ signature: string }>;
}

export type WindowWithPhantom = Window & { 
  solana?: PhantomProvider;
  phantom?: {
    solana?: PhantomProvider;
  };
};

const QUICKNODE_RPC_URL = 'https://old-hidden-sea.solana-mainnet.quiknode.pro/8451b71239184be1451907adce1e53d217c53cb4/';
const QUICKNODE_WS_URL = 'wss://old-hidden-sea.solana-mainnet.quiknode.pro/8451b71239184be1451907adce1e53d217c53cb4/';

const FALLBACK_RPC_URL = 'https://api.mainnet-beta.solana.com';

const TRANSACTION_TIMEOUT = 90 * 1000; // 90 seconds in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

const connectionConfig = {
  commitment: 'confirmed' as Commitment,
  confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
  wsEndpoint: QUICKNODE_WS_URL,
  disableRetryOnRateLimit: false,
  httpHeaders: {
    'Content-Type': 'application/json',
  }
};

const connection = new Connection(QUICKNODE_RPC_URL, connectionConfig);

let fallbackConnection: Connection | null = null;

// Export these utility functions
export const getConnection = (): Connection => {
  return connection;
};

export const getFallbackConnection = (): Connection => {
  if (!fallbackConnection) {
    console.log('Initializing fallback Solana connection');
    fallbackConnection = new Connection(FALLBACK_RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT
    });
  }
  return fallbackConnection;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    
    // Verify the connection is active
    if (!provider.isConnected || !provider.publicKey) {
      throw new Error("Wallet connection verification failed");
    }
    
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

export const getOrCreateAssociatedTokenAccount = async (
  connection: Connection,
  payer: PublicKey,
  owner: PublicKey,
  mint: PublicKey
): Promise<PublicKey> => {
  try {
    // Use the correct program ID for the associatedTokenProgramId parameter (5th parameter)
    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    
    try {
      await getAccount(connection, associatedToken, 'confirmed', TOKEN_PROGRAM_ID);
      return associatedToken;
    } catch (error) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        console.log(`Associated token account for ${owner.toString()} doesn't exist, creating...`);
        
        const transaction = new Transaction();
        transaction.add(
          createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            owner,
            mint,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
        
        const provider = getPhantomProvider();
        if (!provider) {
          throw new Error("Phantom provider not found");
        }
        
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = payer;
        
        console.log("Creating associated token account...");
        const { signature } = await provider.signAndSendTransaction(transaction);
        console.log("Associated token account creation sent, signature:", signature);
        
        await confirmTransactionWithRetry(
          connection,
          signature,
          blockhash,
          lastValidBlockHeight
        );
        
        return associatedToken;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in getOrCreateAssociatedTokenAccount:', error);
    throw new Error(`Failed to get or create associated token account: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const confirmTransactionWithRetry = async (
  connection: Connection,
  signature: string,
  blockhash: string,
  lastValidBlockHeight: number
): Promise<boolean> => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`Confirming transaction, attempt ${attempt + 1}/${MAX_RETRIES}`);
      
      const confirmationResult = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');
      
      if (confirmationResult.value.err) {
        console.warn(`Transaction confirmation returned error on attempt ${attempt + 1}:`, confirmationResult.value.err);
        
        if (attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY);
          continue;
        }
        
        throw new Error(`Transaction failed: ${JSON.stringify(confirmationResult.value.err)}`);
      }
      
      console.log("Transaction confirmed successfully:", signature);
      return true;
    } catch (error) {
      console.error(`Error confirming transaction on attempt ${attempt + 1}:`, error);
      
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY);
      } else {
        throw error;
      }
    }
  }
  
  throw new Error(`Failed to confirm transaction after ${MAX_RETRIES} attempts`);
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
      
      const tokenDecimals = 6;
      const tokenAmount = BigInt(Math.round(amount * 10 ** tokenDecimals));
      
      console.log(`Converting ${amount} SEC tokens to ${tokenAmount} base units (with ${tokenDecimals} decimals)`);
      
      transaction.add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          fromPubkey,
          tokenAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );
      
      try {
        const { blockhash, lastValidBlockHeight } = await activeConnection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;
        
        console.log("Sending SEC token transaction via QuickNode RPC...");
        const { signature } = await provider.signAndSendTransaction(transaction);
        console.log("SEC token transaction sent, signature:", signature);
        
        await confirmTransactionWithRetry(
          activeConnection,
          signature,
          blockhash,
          lastValidBlockHeight
        );
        
        toast({
          title: "Transaction successful",
          description: `Successfully sent ${amount} $SEC tokens to the wallet`,
        });
        
        return signature;
      } catch (error) {
        console.error("Primary QuickNode connection failed, trying fallback:", error);
        
        try {
          const fallbackConn = getFallbackConnection();
          
          const { blockhash, lastValidBlockHeight } = await fallbackConn.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
          
          console.log("Sending SEC token transaction via fallback RPC...");
          const { signature } = await provider.signAndSendTransaction(transaction);
          
          console.log("Fallback SEC token transaction sent, signature:", signature);
          
          await confirmTransactionWithRetry(
            fallbackConn,
            signature,
            blockhash,
            lastValidBlockHeight
          );
          
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
