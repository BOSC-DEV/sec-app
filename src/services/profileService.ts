import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';
import { getProfileStatistics } from './statisticsService';
import { validateFile, compressImage } from '@/utils/fileUpload';

export const getProfiles = async (): Promise<Profile[]> => {
  try {
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
    
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, display_name, username, profile_pic_url')
      .eq('wallet_address', profile.wallet_address)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      throw checkError;
    }
    
    // Create a more readable default display name if not provided
    const defaultDisplayName = profile.display_name || 
      profile.wallet_address
        .split('')
        .filter(char => /[a-zA-Z0-9]/.test(char))
        .join('')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/(\d)([a-zA-Z])/g, '$1 $2')
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .slice(0, 50); // Limit to 50 characters

    let result;

    if (existingProfile) {
      console.log('Updating existing profile with ID:', existingProfile.id);
      
      // Check if display_name or profile_pic has changed
      const displayNameChanged = existingProfile.display_name !== profile.display_name;
      const profilePicChanged = existingProfile.profile_pic_url !== profile.profile_pic_url;
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: defaultDisplayName,
          username: profile.username,
          profile_pic_url: profile.profile_pic_url,
          bio: profile.bio,
          x_link: profile.x_link,
          website_link: profile.website_link
        })
        .eq('id', existingProfile.id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      result = data;
      
      // If display_name or profile_pic has changed, update bounty_contributions table
      if (displayNameChanged || profilePicChanged) {
        const updateData: { contributor_name?: string; contributor_profile_pic?: string } = {};
        
        if (displayNameChanged) {
          updateData.contributor_name = profile.display_name;
        }
        
        if (profilePicChanged) {
          updateData.contributor_profile_pic = profile.profile_pic_url;
        }
        
        await updateBountyContributions(profile.wallet_address, updateData);
      }
      
    } else {
      console.log('Inserting new profile');
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: profile.id,
          wallet_address: profile.wallet_address,
          display_name: defaultDisplayName,
          username: profile.username,
          profile_pic_url: profile.profile_pic_url,
          created_at: new Date().toISOString(),
          bio: profile.bio,
          x_link: profile.x_link,
          website_link: profile.website_link,
          points: 0
        })
        .select('*')
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

const updateBountyContributions = async (
  walletAddress: string, 
  updateData: { contributor_name?: string; contributor_profile_pic?: string }
): Promise<void> => {
  try {
    console.log(`Updating bounty contributions for ${walletAddress}:`, updateData);
    
    const { error } = await supabase
      .from('bounty_contributions')
      .update(updateData)
      .eq('contributor_id', walletAddress);
    
    if (error) {
      console.error('Error updating bounty contributions:', error);
      throw error;
    }
    
    console.log('Successfully updated contributor info in bounty_contributions');
  } catch (error) {
    handleError(error, 'Error updating contributor info in bounty_contributions');
  }
};

export const uploadProfilePicture = async (walletAddress: string, file: File): Promise<string | null> => {
  if (!walletAddress || !file) return null;
  
  try {
    console.log('Starting profile picture upload for wallet:', walletAddress);
    
    const isValid = await validateFile(file, {
      maxSize: 2 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    
    if (!isValid) {
      throw new Error('Invalid file');
    }
    
    const compressedFile = await compressImage(file, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8
    });
    
    if (!compressedFile) {
      throw new Error('Failed to compress image');
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${walletAddress}/${fileName}`;
    
    console.log('Uploading file to path:', filePath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, compressedFile, {
        cacheControl: '0',
        upsert: true,
        contentType: compressedFile.type
      });
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }
    
    console.log('File uploaded successfully, data:', uploadData);
    
    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);
    
    console.log('Generated public URL:', data.publicUrl);
    
    const urlWithCacheBuster = `${data.publicUrl}?t=${Date.now()}`;
    console.log('URL with cache buster:', urlWithCacheBuster);
    
    return urlWithCacheBuster;
  } catch (error) {
    console.error('Profile picture upload error:', error);
    handleError(error, 'Error uploading profile picture');
    return null;
  }
};

export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  if (!username) return null;
  
  try {
    const timestamp = new Date().getTime();
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

export const getProfileByDisplayName = async (displayName: string): Promise<Profile | null> => {
  if (!displayName) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('display_name', displayName)
      .maybeSingle();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    handleError(error, 'Error fetching profile by display name');
    return null;
  }
};
