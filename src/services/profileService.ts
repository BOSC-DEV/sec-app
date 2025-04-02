
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';

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

// Create or update profile
export const saveProfile = async (profile: Partial<Profile>): Promise<Profile> => {
  // Generate a unique ID if one doesn't exist
  const profileId = profile.id || crypto.randomUUID();
  
  const { data, error } = await supabase.rpc('upsert_profile', {
    profile_id: profileId,
    profile_display_name: profile.display_name || '',
    profile_username: profile.username || '',
    profile_pic_url: profile.profile_pic_url || '',
    profile_wallet_address: profile.wallet_address || '',
    profile_created_at: profile.created_at || new Date().toISOString(),
    profile_x_link: profile.x_link || '',
    profile_website_link: profile.website_link || '',
    profile_bio: profile.bio || ''
  });
  
  if (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
  
  // Fetch the updated profile
  const { data: updatedProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', profile.wallet_address)
    .single();
    
  if (fetchError) {
    console.error('Error fetching updated profile:', fetchError);
    throw fetchError;
  }
  
  return updatedProfile;
};
