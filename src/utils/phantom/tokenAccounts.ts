
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { getPhantomProvider } from './provider';
import { confirmTransactionWithRetry } from './connection';
import { SEC_TOKEN_MINT } from './types';

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
