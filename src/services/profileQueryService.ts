
import { Profile } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';
import { sanitizeInput } from '@/utils/securityUtils';
import { ErrorSeverity } from '@/utils/errorSeverity';
import { saveProfile } from './profileUpdateService';

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  try {
    if (!username) {
      throw new Error('No username provided');
    }
    
    const sanitizedUsername = sanitizeInput(username);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', sanitizedUsername)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error fetching profile by username',
      severity: ErrorSeverity.MEDIUM,
      context: 'getProfileByUsername'
    });
    return null;
  }
};

// Get profiles by display name - used in bounty components
export const getProfilesByDisplayName = async (displayName: string): Promise<Profile[]> => {
  try {
    if (!displayName) {
      throw new Error('No display name provided');
    }
    
    const sanitizedDisplayName = sanitizeInput(displayName);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('display_name', sanitizedDisplayName);

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error fetching profiles by display name',
      severity: ErrorSeverity.MEDIUM,
      context: 'getProfilesByDisplayName'
    });
    return [];
  }
};

// Modify getProfileByWallet to use direct Supabase queries and better error handling
export const getProfileByWallet = async (walletAddress: string): Promise<Profile | null> => {
  try {
    if (!walletAddress) {
      throw new Error('No wallet address provided');
    }
    
    console.log("Getting profile by wallet address:", walletAddress);
    const sanitizedWallet = sanitizeInput(walletAddress);
    
    // Skip authentication check to avoid chicken-and-egg problem
    // This allows fetching profile info even when not authenticated
    
    // Directly query profiles table, don't use single() to avoid errors if no profile exists
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', sanitizedWallet)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile by wallet:', error);
      throw error;
    }

    // Return the profile data without updating SEC balance
    // This is to avoid authentication errors when not logged in
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error fetching profile by wallet',
      severity: ErrorSeverity.MEDIUM,
      context: 'getProfileByWallet'
    });
    return null;
  }
};
