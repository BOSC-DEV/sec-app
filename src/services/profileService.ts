import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';
import { handleError, ErrorSeverity } from "@/utils/errorHandling";
import { fileUpload } from "@/utils/fileUpload";

// Generate a sequential ID for a new scammer
export const generateScammerId = async (): Promise<string> => {
  try {
    // Generate a unique ID based on timestamp to avoid collisions
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `scammer-${timestamp}-${randomSuffix}`;
  } catch (e) {
    console.error('Error generating scammer ID:', e);
    // Fallback to a timestamp-based ID if any error occurs
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `scammer-${timestamp}-${randomSuffix}`;
  }
};

// Profile Service
export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
  
  return data || [];
};

export const getProfileByWallet = async (walletAddress: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching profile by wallet:', error);
    throw error;
  }
  
  return data;
};

/**
 * Get profile by username
 */
export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  try {
    console.log(`Fetching profile with username: ${username}`);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching profile by username:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: `Failed to fetch profile with username: ${username}`,
      severity: ErrorSeverity.LOW,
      context: "GET_PROFILE_BY_USERNAME"
    });
    return null;
  }
};

/**
 * Get profiles by display name
 * This handles the case where multiple profiles might have the same display name
 */
export const getProfilesByDisplayName = async (displayName: string) => {
  try {
    console.log(`Fetching profiles with display name: ${displayName}`);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('display_name', displayName);
      
    if (error) {
      console.error('Error fetching profiles by display name:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: `Failed to fetch profiles with display name: ${displayName}`,
      severity: ErrorSeverity.LOW,
      context: "GET_PROFILES_BY_DISPLAY_NAME"
    });
    return [];
  }
};

/**
 * Save a profile to the database
 */
export const saveProfile = async (profile: Profile): Promise<Profile | null> => {
  try {
    // Check if profile exists first
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', profile.wallet_address)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error checking for existing profile:', fetchError);
      throw fetchError;
    }
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('wallet_address', profile.wallet_address)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error creating new profile:', error);
        throw error;
      }
      
      result = data;
    }
    
    return result;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to save profile',
      severity: ErrorSeverity.MEDIUM,
      context: "SAVE_PROFILE"
    });
    return null;
  }
};

/**
 * Upload a profile picture and return the public URL
 */
export const uploadProfilePicture = async (walletAddress: string, file: File): Promise<string | null> => {
  try {
    const folderPath = `profile-pics/${walletAddress}`;
    const fileName = `profile-${Date.now()}.${file.name.split('.').pop()}`;
    
    // Use the fileUpload utility which now uses the correct 'uploads' bucket
    const publicUrl = await fileUpload.uploadFile(file, folderPath, fileName);
    
    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }
    
    console.log('Profile picture uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to upload profile picture',
      severity: ErrorSeverity.MEDIUM,
      context: "UPLOAD_PROFILE_PICTURE"
    });
    return null;
  }
};
