
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { getConnection } from '@/utils/phantomWallet';

// SEC token mint address
export const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

// Get SEC token balance for a wallet
export const getSECTokenBalance = async (walletAddress: string): Promise<number> => {
  try {
    if (!walletAddress) return 0;
    
    console.log(`Fetching SEC token balance for ${walletAddress}`);
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);

    // Get the associated token account address
    const tokenAccountAddress = await getAssociatedTokenAddress(
      SEC_TOKEN_MINT, 
      publicKey,
      false  // Set false as we only need to check if it exists, not create it
    );
    
    try {
      // Get the token account info
      const tokenAccount = await getAccount(connection, tokenAccountAddress);
      const balanceAmount = Number(tokenAccount.amount);
      const humanReadableBalance = balanceAmount / Math.pow(10, 6);
      
      console.log(`SEC balance for ${walletAddress}: ${humanReadableBalance} SEC tokens`);
      return humanReadableBalance;
    } catch (error) {
      // Token account might not exist yet or zero balance
      console.log(`Token account not found for ${walletAddress}, setting balance to 0`);
      return 0;
    }
  } catch (walletError) {
    console.error('Error fetching SEC balance:', walletError);
    return 0;
  }
};
