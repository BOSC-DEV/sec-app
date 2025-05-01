
import { Profile } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';
import { sanitizeInput, sanitizeUrl } from '@/utils/securityUtils';
import { ErrorSeverity } from '@/utils/errorSeverity';
import { updateSecTokenBalance } from './tokenBalanceService';

// Save or update a profile
export const saveProfile = async (profile: Profile): Promise<Profile | null> => {
  try {
    if (!profile) {
      throw new Error('No profile data provided');
    }
    
    console.log("Saving profile:", profile);
    
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('User not authenticated. Please login first.');
      console.log("Session object:", session);
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
      const secBalance = await updateSecTokenBalance(profile);
      updatedProfile.sec_balance = secBalance;
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

// Create a default profile
export const createDefaultProfile = async (walletAddress: string): Promise<Profile | null> => {
  try {
    if (!walletAddress) {
      throw new Error('No wallet address provided for default profile');
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
