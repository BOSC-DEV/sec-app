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
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('wallet_address', profile.wallet_address)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    let result;

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
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
