/**
 * Wallet adapter utilities for multi-wallet support
 * This module provides wallet-agnostic functions that work with any Solana wallet
 * through the @solana/wallet-adapter library.
 */

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  LAMPORTS_PER_SOL,
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
import { WalletContextState } from '@solana/wallet-adapter-react';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';

// Transaction configuration
const TRANSACTION_TIMEOUT = 90 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const FALLBACK_RPC_URL = 'https://api.mainnet-beta.solana.com';

// SEC Token configuration
export const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');
export const SEC_TOKEN_DECIMALS = 6;

const connectionConfig = {
  commitment: 'confirmed' as Commitment,
  confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
  disableRetryOnRateLimit: false,
  httpHeaders: {
    'Content-Type': 'application/json',
  }
};

// Lazy initialization of connections
let primaryConnection: Connection | null = null;
let fallbackConnection: Connection | null = null;

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get the primary Solana connection
 */
export const getConnection = (): Connection => {
  if (!primaryConnection) {
    const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    console.log('Initializing Solana connection with RPC:', rpcUrl);
    primaryConnection = new Connection(rpcUrl, connectionConfig);
  }
  return primaryConnection;
};

/**
 * Get the fallback Solana connection
 */
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

/**
 * Sign a message using the connected wallet adapter
 */
export const signMessageWithWallet = async (
  wallet: WalletContextState,
  message: string
): Promise<string | null> => {
  if (!wallet.connected || !wallet.publicKey || !wallet.signMessage) {
    toast({
      title: 'Wallet not connected',
      description: 'Please connect your wallet first',
      variant: 'destructive',
    });
    return null;
  }

  try {
    console.log('Signing message with wallet...');
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await wallet.signMessage(encodedMessage);
    
    // Convert to base64
    const signatureBase64 = btoa(String.fromCharCode(...signature));
    console.log('Message signed successfully');
    
    return signatureBase64;
  } catch (error: any) {
    console.error('Error signing message:', error);
    
    // Handle user rejection silently
    if (error?.code === 4001 || error?.message?.includes('User rejected')) {
      return null;
    }
    
    toast({
      title: 'Signing error',
      description: 'Failed to sign message with wallet',
      variant: 'destructive',
    });
    return null;
  }
};

/**
 * Confirm a transaction with retry logic
 */
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
      
      console.log('Transaction confirmed successfully:', signature);
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

/**
 * Get or create an associated token account
 */
export const getOrCreateAssociatedTokenAccount = async (
  connection: Connection,
  wallet: WalletContextState,
  owner: PublicKey,
  mint: PublicKey
): Promise<PublicKey> => {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
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
            wallet.publicKey,
            associatedToken,
            owner,
            mint,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
        
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        
        console.log('Creating associated token account...');
        const signature = await wallet.sendTransaction(transaction, connection);
        console.log('Associated token account creation sent, signature:', signature);
        
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

/**
 * Send SEC tokens to a recipient wallet using the wallet adapter
 */
export const sendSECTokensWithWallet = async (
  wallet: WalletContextState,
  recipientAddress: string,
  amount: number
): Promise<string | null> => {
  if (!wallet.connected || !wallet.publicKey || !wallet.sendTransaction) {
    toast({
      title: 'Wallet not connected',
      description: 'Please connect your wallet first',
      variant: 'destructive',
    });
    return null;
  }
  
  if (amount <= 0) {
    toast({
      title: 'Invalid amount',
      description: 'Amount must be greater than 0',
      variant: 'destructive',
    });
    return null;
  }
  
  try {
    console.log(`Processing SEC token transaction to ${recipientAddress} for ${amount} $SEC tokens...`);
    
    let toPubkey: PublicKey;
    try {
      toPubkey = new PublicKey(recipientAddress);
    } catch (error) {
      toast({
        title: 'Invalid recipient address',
        description: 'The recipient address is not a valid Solana address',
        variant: 'destructive',
      });
      return null;
    }
    
    const activeConnection = getConnection();
    const fromPubkey = wallet.publicKey;
    
    try {
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        activeConnection,
        wallet,
        fromPubkey,
        SEC_TOKEN_MINT
      );
      
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        activeConnection,
        wallet,
        toPubkey,
        SEC_TOKEN_MINT
      );
      
      const tokenAmount = BigInt(Math.round(amount * 10 ** SEC_TOKEN_DECIMALS));
      
      console.log(`Converting ${amount} SEC tokens to ${tokenAmount} base units (with ${SEC_TOKEN_DECIMALS} decimals)`);
      
      const transaction = new Transaction();
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
        
        console.log('Sending SEC token transaction via Solana RPC...');
        const signature = await wallet.sendTransaction(transaction, activeConnection);
        console.log('SEC token transaction sent, signature:', signature);
        
        await confirmTransactionWithRetry(
          activeConnection,
          signature,
          blockhash,
          lastValidBlockHeight
        );
        
        toast({
          title: 'Transaction successful',
          description: `Successfully sent ${amount} $SEC tokens to the wallet`,
        });
        
        return signature;
      } catch (error) {
        console.error('Primary RPC connection failed, trying fallback:', error);
        
        try {
          const fallbackConn = getFallbackConnection();
          
          const { blockhash, lastValidBlockHeight } = await fallbackConn.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
          
          console.log('Sending SEC token transaction via fallback RPC...');
          const signature = await wallet.sendTransaction(transaction, fallbackConn);
          
          console.log('Fallback SEC token transaction sent, signature:', signature);
          
          await confirmTransactionWithRetry(
            fallbackConn,
            signature,
            blockhash,
            lastValidBlockHeight
          );
          
          toast({
            title: 'Transaction successful (fallback)',
            description: `Successfully sent ${amount} $SEC tokens to the wallet`,
          });
          
          return signature;
        } catch (fallbackError) {
          throw new Error(`Both primary and fallback RPC failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error while preparing transaction:', error);
      throw error;
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to process SEC token transaction. Please try again later.',
      severity: ErrorSeverity.HIGH,
      context: 'PROCESS_TOKEN_TRANSACTION'
    });
    return null;
  }
};
