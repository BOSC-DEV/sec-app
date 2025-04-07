
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';
import { getProfileStatistics } from './statisticsService';

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
    // Create a unique file path for the avatar
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${walletAddress}/${Date.now()}.${fileExt}`;
    
    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
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
