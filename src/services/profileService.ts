
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';
import { getProfileStatistics } from './statisticsService';
import { validateFile, compressImage } from '@/utils/fileUpload';

export const getProfiles = async (): Promise<Profile[]> => {
  try {
    // Use the enhanced getProfileStatistics function to get profiles with counts
    const profilesWithStats = await getProfileStatistics();
    return profilesWithStats || [];
  } catch (error) {
    handleError(error, 'Error fetching profiles');
    return [];
  }
};

export const getProfileByWallet = async (walletAddress: string): Promise<Profile | null> => {
  if (!walletAddress) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    handleError(error, 'Error fetching profile by wallet');
    return null;
  }
};

export const saveProfile = async (profile: Profile): Promise<Profile | null> => {
  try {
    console.log('Saving profile:', profile);
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('wallet_address', profile.wallet_address)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      throw checkError;
    }
    
    let result;

    if (existingProfile) {
      console.log('Updating existing profile with ID:', existingProfile.id);
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          username: profile.username,
          profile_pic_url: profile.profile_pic_url,
          bio: profile.bio,
          x_link: profile.x_link,
          website_link: profile.website_link
        })
        .eq('id', existingProfile.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      result = data;
    } else {
      console.log('Inserting new profile');
      // Insert new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: profile.id,
          wallet_address: profile.wallet_address,
          display_name: profile.display_name,
          username: profile.username,
          profile_pic_url: profile.profile_pic_url,
          created_at: new Date().toISOString(),
          bio: profile.bio,
          x_link: profile.x_link,
          website_link: profile.website_link,
          points: 0
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting profile:', error);
        throw error;
      }
      
      result = data;
    }
    
    console.log('Profile saved successfully:', result);
    return result;
  } catch (error) {
    handleError(error, 'Error saving profile');
    return null;
  }
};

export const uploadProfilePicture = async (walletAddress: string, file: File): Promise<string | null> => {
  if (!walletAddress || !file) return null;
  
  try {
    console.log('Starting profile picture upload for wallet:', walletAddress);
    
    // Validate the file first
    const isValid = await validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    
    if (!isValid) {
      throw new Error('Invalid file');
    }
    
    // Compress the image to reduce size while maintaining quality
    const compressedFile = await compressImage(file, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8
    });
    
    if (!compressedFile) {
      throw new Error('Failed to compress image');
    }
    
    // Create a unique file path for the avatar
    const fileExt = file.name.split('.').pop();
    const filePath = `${walletAddress}/${Date.now()}.${fileExt}`;
    
    console.log('Uploading file to path:', filePath);
    
    // Upload the file with public-read access
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: compressedFile.type
      });
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }
    
    console.log('File uploaded successfully, data:', uploadData);
    
    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);
    
    console.log('Generated public URL:', data.publicUrl);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Profile picture upload error:', error);
    handleError(error, 'Error uploading profile picture');
    return null;
  }
};

export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  if (!username) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    handleError(error, 'Error fetching profile by username');
    return null;
  }
};
