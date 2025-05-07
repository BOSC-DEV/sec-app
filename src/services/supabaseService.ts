
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/dataTypes';
import { getProfileByWallet } from '@/services/profileService';

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

// Use the imported function from profileService instead of duplicating
// This ensures we maintain a single source of truth
export { getProfileByWallet };
