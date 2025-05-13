import { Profile } from '@/types/dataTypes';
import { supabase, safeQuery } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';
import { sanitizeInput } from '@/utils/securityUtils';
import { ErrorSeverity } from '@/utils/errorSeverity';
import { saveProfile } from './profileUpdateService';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';

type QueryPromise<T> = Promise<{ data: T | null; error: any }>;

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  try {
    if (!username) {
      throw new Error('No username provided');
    }
    
    const sanitizedUsername = sanitizeInput(username);
    
    const { data, error } = await safeQuery<Profile>(
      'read',
      () => supabase
        .from('profiles')
        .select('*')
        .eq('username', sanitizedUsername)
        .maybeSingle()
        .then(result => Promise.resolve({ data: result.data as Profile, error: result.error })) as QueryPromise<Profile>,
      { bypassAuth: true } // Allow public read access
    );

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
    
    const { data, error } = await safeQuery<Profile[]>(
      'read',
      () => supabase
        .from('profiles')
        .select('*')
        .eq('display_name', sanitizedDisplayName)
        .then(result => Promise.resolve({ data: result.data as Profile[], error: result.error })) as QueryPromise<Profile[]>,
      { bypassAuth: true } // Allow public read access
    );

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error fetching profiles by display name',
      severity: ErrorSeverity.MEDIUM,
      context: 'getProfilesByDisplayName'
    });
    return [];
  }
};

// Get profile by wallet with proper typing
export const getProfileByWallet = async (walletAddress: string): Promise<Profile | null> => {
  try {
    if (!walletAddress) {
      throw new Error('No wallet address provided');
    }
    
    console.log("Getting profile by wallet address:", walletAddress);
    const sanitizedWallet = sanitizeInput(walletAddress);
    
    const { data, error } = await safeQuery<Profile>(
      'read',
      () => supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', sanitizedWallet)
        .maybeSingle()
        .then(result => Promise.resolve({ data: result.data as Profile, error: result.error })) as QueryPromise<Profile>,
      { bypassAuth: true } // Allow public read access for basic profile info
    );

    if (error) {
      console.error('Error fetching profile by wallet:', error);
      throw error;
    }

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
