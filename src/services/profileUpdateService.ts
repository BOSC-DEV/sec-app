import { Profile } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';
import { sanitizeInput, sanitizeUrl } from '@/utils/securityUtils';
import { ErrorSeverity } from '@/utils/errorSeverity';
import { getSECTokenBalance } from './tokenBalanceService';

// Modified saveProfile function to work with Supabase auth
export const saveProfile = async (profile: Profile): Promise<Profile | null> => {
  try {
    if (!profile) {
      throw new Error('No profile data provided');
    }
    
    console.log("Saving profile:", profile);
    
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    
    // Allow saving profiles even when not authenticated in certain scenarios
    // This helps with displaying basic profile information for public pages
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
    if (profile.wallet_address && session) {
      try {
        // Only update balance if authenticated
        const secBalance = await getSECTokenBalance(profile.wallet_address);
        updatedProfile.sec_balance = secBalance;
      } catch (walletError) {
        console.error('Error fetching SEC balance:', walletError);
        // Keep existing balance if there's an error
      }
    }

    // For profile updates that modify data, require authentication
    if (!session && 
        (profile.username || profile.display_name || profile.bio || 
         profile.x_link || profile.website_link || profile.profile_pic_url)) {
      console.error('User not authenticated. Please login first.');
      console.log("Session object:", session);
      throw new Error('Authentication required to update profile');
    }

    console.log("Upserting profile with data:", updatedProfile);

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
    
    console.log("Profile saved successfully:", data);
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

// Create a default profile for a wallet
export const createDefaultProfile = async (walletAddress: string): Promise<Profile | null> => {
  try {
    if (!walletAddress) {
      throw new Error('No wallet address provided');
    }
    
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
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error creating default profile',
      severity: ErrorSeverity.MEDIUM,
      context: 'createDefaultProfile'
    });
    return null;
  }
};
