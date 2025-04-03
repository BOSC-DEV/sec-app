
import { supabase } from '@/integrations/supabase/client';
import { Scammer } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';

// Scammers Service
export const getScammers = async (): Promise<Scammer[]> => {
  try {
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .is('deleted_at', null);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    handleError(error, 'Error fetching scammers');
    return [];
  }
};

export const getScammerById = async (id: string): Promise<Scammer | null> => {
  try {
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      throw error;
    }
    
    if (data) {
      try {
        // Generate a unique IP hash based on timestamp to avoid constraint violations
        const ipHash = `anonymous-${new Date().getTime()}`;
        
        // Check if this view is a duplicate using our new database function
        const { data: isDuplicate } = await supabase
          .rpc('is_duplicate_view', { 
            p_scammer_id: id, 
            p_ip_hash: ipHash 
          });
        
        // Only insert view record if it's not a duplicate
        if (!isDuplicate) {
          await supabase
            .from('scammer_views')
            .insert({ scammer_id: id, ip_hash: ipHash });
        }
      } catch (e) {
        // Silently fail on view tracking errors to not disrupt user experience
        console.error('Failed to track view:', e);
      }
    }
    
    return data;
  } catch (error) {
    handleError(error, `Error fetching scammer with ID ${id}`);
    return null;
  }
};

// Generate a sequential ID for a new scammer
export const generateScammerId = async (): Promise<string> => {
  try {
    // Get the highest scammer ID currently in the database
    const { data, error } = await supabase
      .from('scammers')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // If there are no scammers yet, start with 1
    if (!data || data.length === 0) {
      return '1';
    }
    
    // Extract the current highest ID and increment by 1
    const currentHighestId = data[0].id;
    // Handle both numeric and timestamp-based ids during transition
    const isNumeric = /^\d+$/.test(currentHighestId);
    
    if (isNumeric) {
      return (parseInt(currentHighestId, 10) + 1).toString();
    } else {
      // If we still have old timestamp-based IDs, start the sequence from 1
      return '1';
    }
  } catch (error) {
    handleError(error, 'Error generating scammer ID');
    return `${Date.now()}`; // Fallback to timestamp-based ID
  }
};

export const getTopScammers = async (limit: number = 3): Promise<Scammer[]> => {
  try {
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .is('deleted_at', null)
      .order('bounty_amount', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    handleError(error, 'Error fetching top scammers');
    return [];
  }
};

export const getScammersByReporter = async (walletAddress: string): Promise<Scammer[]> => {
  if (!walletAddress) return [];
  
  try {
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .eq('added_by', walletAddress)
      .is('deleted_at', null)
      .order('date_added', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    handleError(error, 'Error fetching scammers by reporter');
    return [];
  }
};
