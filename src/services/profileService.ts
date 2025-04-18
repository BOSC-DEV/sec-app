
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { getConnection } from '@/utils/phantomWallet';
import { Profile } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';

// SEC token mint address
const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

// Function to upload profile picture
export const uploadProfilePicture = async (walletAddress: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${walletAddress}-${Date.now()}.${fileExt}`;
    const filePath = `profile-pics/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return null;
  }
};

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile by username:', error);
    return null;
  }
};

// Get profiles by display name - used in bounty components
export const getProfilesByDisplayName = async (displayName: string): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('display_name', displayName);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching profiles by display name:', error);
    return [];
  }
};

// Extend existing saveProfile function to fetch and update SEC balance
export const saveProfile = async (profile: Profile): Promise<Profile | null> => {
  try {
    let updatedProfile = { ...profile };

    // If wallet address is present, fetch SEC balance
    if (profile.wallet_address) {
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
          
          // Update the profile with SEC balance
          updatedProfile.sec_balance = secBalance;
        } catch (error) {
          // Token account might not exist yet or zero balance
          console.log('Token account not found, setting balance to 0');
          updatedProfile.sec_balance = 0;
        }
      } catch (walletError) {
        console.error('Error fetching SEC balance:', walletError);
        updatedProfile.sec_balance = 0;
      }
    }

    // Call the existing upsert function in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        ...updatedProfile,
        id: profile.id,
        wallet_address: profile.wallet_address
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error saving profile with SEC balance:', error);
    return null;
  }
};

// Modify getProfileByWallet to use the same balance fetching logic
export const getProfileByWallet = async (walletAddress: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (error) throw error;

    // If profile exists, ensure SEC balance is up to date
    if (data) {
      return await saveProfile(data);
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile by wallet:', error);
    return null;
  }
};
