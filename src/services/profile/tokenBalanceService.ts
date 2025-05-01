
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { getConnection } from '@/utils/phantomWallet';
import { Profile } from '@/types/dataTypes';

// SEC token mint address
const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

// Update SEC token balance in profile
export const updateSecTokenBalance = async (profile: Profile): Promise<number> => {
  if (!profile.wallet_address) {
    return 0;
  }
  
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(profile.wallet_address);

    // Get the associated token account address
    const tokenAccountAddress = await getAssociatedTokenAddress(SEC_TOKEN_MINT, publicKey);
    
    try {
      // Get the token account info
      const tokenAccount = await getAccount(connection, tokenAccountAddress);

      // Convert amount (BigInt) to human-readable format with 6 decimals
      const secBalance = Number(tokenAccount.amount) / Math.pow(10, 6);
      return secBalance;
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
