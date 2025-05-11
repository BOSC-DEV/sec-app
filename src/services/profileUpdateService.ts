
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';
import { toast } from '@/hooks/use-toast';

/**
 * Saves a user profile to the database
 * 
 * @param profile The profile object to save
 * @returns The saved profile, or null if there was an error
 */
export const saveProfile = async (profile: Profile): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([profile], { 
        onConflict: 'id,wallet_address',
        ignoreDuplicates: false
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error('Exception saving profile:', error);
    toast({
      title: 'Error',
      description: 'Failed to save profile',
      variant: 'destructive',
    });
    return null;
  }
};

/**
 * Creates a default profile for a new user
 * @param walletAddress The wallet address of the user
 * @returns The created profile, or null if there was an error
 */
export const createDefaultProfile = async (walletAddress: string): Promise<Profile | null> => {
  try {
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
    console.error('Exception creating default profile:', error);
    return null;
  }
};
