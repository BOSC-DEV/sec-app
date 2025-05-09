
import { PublicKey, Transaction } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';
import { getPhantomProvider } from './provider';
import { getConnection, getFallbackConnection, confirmTransactionWithRetry } from './connection';
import { getOrCreateAssociatedTokenAccount } from './tokenAccounts';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';
import { createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SEC_TOKEN_MINT } from './types';

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
