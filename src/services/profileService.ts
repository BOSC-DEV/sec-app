import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';

// Upload profile picture
export const uploadProfilePicture = async (walletAddress: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${walletAddress}-${Date.now()}.${fileExt}`;
    const filePath = `${walletAddress}/${fileName}`;
    
    // Upload the file to the profile_pictures bucket
    const { error: uploadError } = await supabase.storage
      .from('profile_pictures')
      .upload(filePath, file, {
        upsert: true
      });
      
    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from('profile_pictures')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    return null;
  }
};

// Upload scammer photo
export const uploadScammerPhoto = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `scammer-${Date.now()}.${fileExt}`;
    
    // Upload the file to the scammer_photos bucket
    const { error: uploadError } = await supabase.storage
      .from('scammer_photos')
      .upload(fileName, file, {
        upsert: true
      });
      
    if (uploadError) {
      console.error('Error uploading scammer photo:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from('scammer_photos')
      .getPublicUrl(fileName);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadScammerPhoto:', error);
    return null;
  }
};

// Get profile by wallet address
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

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
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
};

// Create or update profile
export const saveProfile = async (profile: Partial<Profile>): Promise<Profile> => {
  // Check if the profile already exists
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('wallet_address', profile.wallet_address)
    .maybeSingle();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking existing profile:', checkError);
    throw checkError;
  }
  
  // If profile exists, update it
  if (existingProfile) {
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
    
    return data;
  } 
  // Otherwise, insert a new profile
  else {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: profile.id || crypto.randomUUID(),
        wallet_address: profile.wallet_address,
        display_name: profile.display_name,
        username: profile.username,
        profile_pic_url: profile.profile_pic_url,
        bio: profile.bio,
        x_link: profile.x_link,
        website_link: profile.website_link,
        created_at: profile.created_at || new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    return data;
  }
};
