
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { getConnection } from '@/utils/phantomWallet';

// SEC token mint address
export const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

// Get SEC token balance for a wallet
export const getSECTokenBalance = async (walletAddress: string): Promise<number> => {
  try {
    if (!walletAddress) {
      console.log('No wallet address provided, returning 0 balance');
      return 0;
    }
    
    console.log('Fetching SEC balance for wallet:', walletAddress);
    const connection = getConnection();
    
    try {
      const publicKey = new PublicKey(walletAddress);

      // Get the associated token account address
      const tokenAccountAddress = await getAssociatedTokenAddress(SEC_TOKEN_MINT, publicKey);
      
      try {
        // Get the token account info
        const tokenAccount = await getAccount(connection, tokenAccountAddress);

        // Convert amount (BigInt) to human-readable format with 6 decimals
        const balance = Number(tokenAccount.amount) / Math.pow(10, 6);
        console.log('SEC balance fetched successfully:', balance);
        return balance;
      } catch (error: any) {
        // Token account might not exist yet or zero balance
        if (error.name === 'TokenAccountNotFoundError') {
          console.log('Token account not found for wallet:', walletAddress);
          return 0;
        }
        
        // For development/testing purposes, return a mock balance when the connection fails
        if (!window.location.hostname.includes('sec.digital')) {
          const mockBalance = Math.floor(Math.random() * 10000) / 100;
          console.log('Using mock SEC balance for development:', mockBalance);
          return mockBalance;
        }
        
        console.error('Error fetching token account:', error);
        return 0;
      }
    } catch (keyError) {
      console.error('Invalid wallet public key:', keyError);
      return 0;
    }
  } catch (walletError) {
    console.error('Error in getSECTokenBalance:', walletError);
    
    // For development/testing purposes, return a mock balance when the connection fails
    if (!window.location.hostname.includes('sec.digital')) {
      const mockBalance = Math.floor(Math.random() * 10000) / 100;
      console.log('Using mock SEC balance due to error:', mockBalance);
      return mockBalance;
    }
    
    return 0;
  }
};
