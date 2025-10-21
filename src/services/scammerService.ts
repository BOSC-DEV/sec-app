
import { supabase } from '@/integrations/supabase/client';
import { Scammer } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';
import { sanitizeInput } from '@/utils/securityUtils';
import { ErrorSeverity } from '@/utils/errorSeverity';

export const getScammers = async (): Promise<Scammer[]> => {
  try {
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .is('deleted_at', null);
    
    if (error) {
      console.error('Error fetching scammers:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to fetch scammers',
      severity: ErrorSeverity.MEDIUM,
      context: 'getScammers'
    });
    return [];
  }
};

export const getScammerById = async (id: string): Promise<Scammer | null> => {
  try {
    // Validate and sanitize input
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid scammer ID provided');
    }
    
    const sanitizedId = sanitizeInput(id);
    
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .eq('id', sanitizedId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching scammer by ID:', error);
      throw error;
    }
    
    if (data) {
      try {
        // Generate a unique IP hash based on timestamp to avoid constraint violations
        // In a production environment, you would use a real visitor ID
        const visitorId = localStorage.getItem('visitor_id') || `visitor-${Date.now()}`;
        
        // Check if this view is a duplicate using our new database function
        const { data: isDuplicate } = await supabase
          .rpc('is_duplicate_view', { 
            p_scammer_id: sanitizedId, 
            p_visitor_id: visitorId 
          });
        
        // Only insert view record if it's not a duplicate
        if (!isDuplicate) {
          // Insert view record
          const { error: viewError } = await supabase
            .from('scammer_views')
            .insert({ scammer_id: sanitizedId, visitor_id: visitorId });
            
          if (viewError) {
            console.error('Error logging scammer view:', viewError);
          }
        }
      } catch (e) {
        // Silently fail on view tracking errors to not disrupt user experience
        console.error('Failed to track view:', e);
      }
    }
    
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to fetch scammer details',
      severity: ErrorSeverity.MEDIUM,
      context: 'getScammerById'
    });
    return null;
  }
};

export const getTopScammers = async (limit: number = 3): Promise<Scammer[]> => {
  try {
    // Validate input
    const sanitizedLimit = Math.min(Math.max(1, limit), 50); // Between 1 and 50
    
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .is('deleted_at', null)
      .order('bounty_amount', { ascending: false })
      .limit(sanitizedLimit);
    
    if (error) {
      console.error('Error fetching top scammers:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to fetch top scammers',
      severity: ErrorSeverity.MEDIUM,
      context: 'getTopScammers'
    });
    return [];
  }
};

export const getScammersByReporter = async (walletAddress: string): Promise<Scammer[]> => {
  try {
    // Validate input
    if (!walletAddress || typeof walletAddress !== 'string') {
      throw new Error('Invalid wallet address provided');
    }
    
    const sanitizedWallet = sanitizeInput(walletAddress);
    
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .eq('added_by', sanitizedWallet)
      .order('date_added', { ascending: false });
    
    if (error) {
      console.error('Error fetching scammers by reporter:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to fetch reported scammers',
      severity: ErrorSeverity.MEDIUM,
      context: 'getScammersByReporter'
    });
    return [];
  }
};

// Get scammers liked by a user
export const getLikedScammersByUser = async (walletAddress: string): Promise<Scammer[]> => {
  try {
    if (!walletAddress) {
      console.error('No wallet address provided to getLikedScammersByUser');
      return [];
    }
    
    const sanitizedWallet = sanitizeInput(walletAddress);
    
    // Get all the scammer IDs that this user has liked
    const { data: interactions, error: interactionsError } = await supabase
      .from('user_scammer_interactions')
      .select('scammer_id')
      .eq('user_id', sanitizedWallet)
      .eq('liked', true);
    
    if (interactionsError) {
      console.error('Error fetching liked interactions:', interactionsError);
      throw interactionsError;
    }
    
    if (!interactions || interactions.length === 0) {
      console.log(`No liked scammers found for user: ${sanitizedWallet}`);
      return [];
    }
    
    // Extract the scammer IDs from the interactions
    const scammerIds = interactions.map(interaction => interaction.scammer_id);
    console.log(`Found ${scammerIds.length} liked scammer IDs:`, scammerIds);
    
    // Fetch the full scammer details for each ID
    const { data: scammers, error: scammersError } = await supabase
      .from('scammers')
      .select('*')
      .in('id', scammerIds);
    
    if (scammersError) {
      console.error('Error fetching scammers by ID:', scammersError);
      throw scammersError;
    }
    
    console.log(`Successfully fetched ${scammers?.length || 0} liked scammers`);
    return scammers || [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to fetch liked scammers',
      severity: ErrorSeverity.MEDIUM,
      context: 'getLikedScammersByUser'
    });
    return [];
  }
};

/**
 * Archives a scammer report by setting the deleted_at timestamp
 * The report will no longer appear in standard searches but bounties remain accessible
 */
export const deleteScammer = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      throw new Error('Invalid scammer ID provided');
    }
    
    const sanitizedId = sanitizeInput(id);
    
    console.log(`Archiving scammer report: ${sanitizedId}`);
    
    const { error } = await supabase
      .from('scammers')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', sanitizedId);
    
    if (error) {
      console.error('Error archiving scammer:', error);
      throw error;
    }
    
    console.log(`Successfully archived scammer report: ${sanitizedId}`);
    return true;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to archive scammer report',
      severity: ErrorSeverity.MEDIUM,
      context: 'deleteScammer'
    });
    return false;
  }
};

/**
 * Unarchives a scammer report by clearing the deleted_at timestamp
 * The report will reappear in standard searches 
 */
export const unarchiveScammer = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      throw new Error('Invalid scammer ID provided');
    }
    
    const sanitizedId = sanitizeInput(id);
    
    console.log(`Unarchiving scammer report: ${sanitizedId}`);
    
    const { error } = await supabase
      .from('scammers')
      .update({ deleted_at: null })
      .eq('id', sanitizedId);
    
    if (error) {
      console.error('Error unarchiving scammer:', error);
      throw error;
    }
    
    console.log(`Successfully unarchived scammer report: ${sanitizedId}`);
    return true;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to unarchive scammer report',
      severity: ErrorSeverity.MEDIUM,
      context: 'unarchiveScammer'
    });
    return false;
  }
};

/**
 * Returns true if a scammer report exists, even if it's archived
 */
export const scammerExists = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      throw new Error('Invalid scammer ID provided');
    }
    
    const sanitizedId = sanitizeInput(id);
    
    const { data, error } = await supabase
      .from('scammers')
      .select('id')
      .eq('id', sanitizedId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking if scammer exists:', error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to check if scammer exists',
      severity: ErrorSeverity.LOW,
      context: 'scammerExists'
    });
    return false;
  }
};
