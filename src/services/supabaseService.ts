
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';

// Profile Service
export const getProfiles = async (): Promise<Profile[]> => {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // Authenticated: use full profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
    
    return data || [];
  } else {
    // Anonymous: use public view (no wallet addresses)
    // Add empty wallet_address for type compatibility
    const { data, error } = await supabase
      .from('profiles_public')
      .select('*');
    
    if (error) {
      console.error('Error fetching public profiles:', error);
      throw error;
    }
    
    return (data || []).map(profile => ({
      ...profile,
      wallet_address: '', // Hidden for anonymous users
      is_admin: false
    })) as Profile[];
  }
};

export const getProfileByWallet = async (walletAddress: string): Promise<Profile | null> => {
  // Only authenticated users can search by wallet address
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('Authentication required to fetch profile by wallet');
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('wallet_address', walletAddress)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching profile by wallet:', error);
    throw error;
  }
  
  return data;
};
