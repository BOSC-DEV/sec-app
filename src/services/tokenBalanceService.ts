
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { getConnection } from '@/utils/phantomWallet';

// SEC token mint address
export const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

// Get SEC token balance for a wallet
export const getSECTokenBalance = async (walletAddress: string): Promise<number> => {
  try {
    if (!walletAddress) return 0;
    
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);

    // Get the associated token account address
    const tokenAccountAddress = await getAssociatedTokenAddress(SEC_TOKEN_MINT, publicKey);
    
    try {
      // Get the token account info
      const tokenAccount = await getAccount(connection, tokenAccountAddress);

      // Convert amount (BigInt) to human-readable format with 6 decimals
      return Number(tokenAccount.amount) / Math.pow(10, 6);
    } catch (error) {
      // Token account might not exist yet or zero balance
      console.log('Token account not found, setting balance to 0');
      return 0;
    }
  } catch (walletError) {
    console.error('Error fetching SEC balance:', walletError);
    return 0;
  }
};
