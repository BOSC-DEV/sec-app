import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { getConnection } from '@/utils/phantomWallet';
import { Profile } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';
import { sanitizeInput, sanitizeUrl } from '@/utils/securityUtils';
import { ErrorSeverity } from '@/utils/errorSeverity';

// SEC token mint address
const SEC_TOKEN_MINT = new PublicKey('HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump');

// Function to upload profile picture
export const uploadProfilePicture = async (walletAddress: string, file: File): Promise<string | null> => {
  try {
    if (!walletAddress || !file) {
      throw new Error('Missing required parameters for profile picture upload');
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed');
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }
    
    const sanitizedWallet = sanitizeInput(walletAddress);
    const fileExt = file.name.split('.').pop();
    const fileName = `${sanitizedWallet}-${Date.now()}.${fileExt}`;
    const filePath = `profile-pics/${fileName}`;

    // Ensure user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required to upload profile picture');
    }

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error uploading profile picture',
      severity: ErrorSeverity.MEDIUM,
      context: 'uploadProfilePicture'
    });
    return null;
  }
};

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  try {
    if (!username) {
      throw new Error('No username provided');
    }
    
    const sanitizedUsername = sanitizeInput(username);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', sanitizedUsername)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error fetching profile by username',
      severity: ErrorSeverity.MEDIUM,
      context: 'getProfileByUsername'
    });
    return null;
  }
};

// Get profiles by display name - used in bounty components
export const getProfilesByDisplayName = async (displayName: string): Promise<Profile[]> => {
  try {
    if (!displayName) {
      throw new Error('No display name provided');
    }
    
    const sanitizedDisplayName = sanitizeInput(displayName);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('display_name', sanitizedDisplayName);

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error fetching profiles by display name',
      severity: ErrorSeverity.MEDIUM,
      context: 'getProfilesByDisplayName'
    });
    return [];
  }
};

// Modified saveProfile function to work with Supabase auth
export const saveProfile = async (profile: Profile): Promise<Profile | null> => {
  try {
    if (!profile) {
      throw new Error('No profile data provided');
    }
    
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('User not authenticated. Please login first.');
      throw new Error('Authentication required to update profile');
    }
    
    let updatedProfile = { ...profile };

    // Sanitize profile data
    if (updatedProfile.username) {
      updatedProfile.username = sanitizeInput(updatedProfile.username);
    }
    if (updatedProfile.display_name) {
      updatedProfile.display_name = sanitizeInput(updatedProfile.display_name);
    }
    if (updatedProfile.bio) {
      updatedProfile.bio = sanitizeInput(updatedProfile.bio);
    }
    if (updatedProfile.x_link) {
      updatedProfile.x_link = sanitizeUrl(updatedProfile.x_link);
    }
    if (updatedProfile.website_link) {
      updatedProfile.website_link = sanitizeUrl(updatedProfile.website_link);
    }
    if (updatedProfile.profile_pic_url) {
      updatedProfile.profile_pic_url = sanitizeUrl(updatedProfile.profile_pic_url);
    }

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

    if (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error saving profile with SEC balance',
      severity: ErrorSeverity.MEDIUM,
      context: 'saveProfile'
    });
    return null;
  }
};

// Modify getProfileByWallet to use the same balance fetching logic
export const getProfileByWallet = async (walletAddress: string): Promise<Profile | null> => {
  try {
    if (!walletAddress) {
      throw new Error('No wallet address provided');
    }
    
    const sanitizedWallet = sanitizeInput(walletAddress);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', sanitizedWallet)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile by wallet:', error);
      throw error;
    }

    // If profile exists, ensure SEC balance is up to date
    if (data) {
      return await saveProfile(data);
    }
    
    // If no profile exists but we have a wallet address, create a default one
    if (!data && walletAddress) {
      const defaultProfile: Profile = {
        id: crypto.randomUUID(),
        wallet_address: walletAddress,
        display_name: `User ${walletAddress.substring(0, 6)}`,
        username: `user_${Date.now().toString(36)}`,
        profile_pic_url: '',
        created_at: new Date().toISOString(),
        x_link: '',
        website_link: '',
        bio: '',
        points: 0
      };
      
      return await saveProfile(defaultProfile);
    }

    return null;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error fetching profile by wallet',
      severity: ErrorSeverity.MEDIUM,
      context: 'getProfileByWallet'
    });
    return null;
  }
};
