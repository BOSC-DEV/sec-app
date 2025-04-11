
import { supabase } from '@/integrations/supabase/client';
import { Scammer } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';

// Generate a sequential ID for a new scammer
export const generateScammerId = async (): Promise<string> => {
  try {
    // Get the highest current numeric ID
    const { data, error } = await supabase
      .from('scammers')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching highest ID:', error);
      throw error;
    }
    
    // Parse the highest ID and increment by 1
    let nextId = 1;
    
    if (data && data.length > 0) {
      const currentId = parseInt(data[0].id);
      if (!isNaN(currentId)) {
        nextId = currentId + 1;
      }
    }
    
    return nextId.toString();
  } catch (e) {
    console.error('Error generating scammer ID:', e);
    // Fallback to a timestamp-based ID if any error occurs
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomSuffix}`;
  }
};

export const getScammers = async (): Promise<Scammer[]> => {
  const { data, error } = await supabase
    .from('scammers')
    .select('*')
    .is('deleted_at', null);
  
  if (error) {
    console.error('Error fetching scammers:', error);
    throw error;
  }
  
  return data || [];
};

export const searchScammers = async (
  searchQuery: string = '',
  sortBy: string = 'bounty',
  sortDirection: 'asc' | 'desc' = 'desc',
  page: number = 0,
  pageSize: number = 10
): Promise<{ data: Scammer[], count: number }> => {
  const startIndex = page * pageSize;
  
  // Initialize the query
  let query = supabase
    .from('scammers')
    .select('*', { count: 'exact' })
    .is('deleted_at', null);
  
  // Add search functionality if a query is provided
  if (searchQuery) {
    query = query.or(
      `name.ilike.%${searchQuery}%,accused_of.ilike.%${searchQuery}%,aliases.cs.{${searchQuery}}`
    );
  }
  
  // Add sorting
  const sortColumn = getSortColumn(sortBy);
  query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
  
  // Add pagination
  query = query.range(startIndex, startIndex + pageSize - 1);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error searching scammers:', error);
    throw error;
  }
  
  return { 
    data: data || [], 
    count: count || 0 
  };
};

// Helper function to map sort option to database column
const getSortColumn = (sortBy: string): string => {
  switch (sortBy) {
    case 'name':
      return 'name';
    case 'date':
      return 'date_added';
    case 'views':
      return 'views';
    case 'likes':
      return 'likes';
    case 'bounty':
    default:
      return 'bounty_amount';
  }
};

export const getScammerById = async (id: string): Promise<Scammer | null> => {
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
    console.error('Error fetching scammer by ID:', error);
    throw error;
  }
  
  if (data) {
    try {
      // Generate a unique IP hash based on timestamp to avoid constraint violations
      // In a production environment, you would use a real IP address hash
      const ipHash = `anonymous-${new Date().getTime()}`;
      
      // Check if this view is a duplicate using our new database function
      const { data: isDuplicate } = await supabase
        .rpc('is_duplicate_view', { 
          p_scammer_id: id, 
          p_ip_hash: ipHash 
        });
      
      // Only insert view record if it's not a duplicate
      if (!isDuplicate) {
        // Insert view record - this will trigger our increment_scammer_views function
        const { error: viewError } = await supabase
          .from('scammer_views')
          .insert({ scammer_id: id, ip_hash: ipHash });
          
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
};

export const getTopScammers = async (limit: number = 3): Promise<Scammer[]> => {
  const { data, error } = await supabase
    .from('scammers')
    .select('*')
    .is('deleted_at', null)
    .order('bounty_amount', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching top scammers:', error);
    throw error;
  }
  
  return data || [];
};

export const getScammersByReporter = async (walletAddress: string): Promise<Scammer[]> => {
  const { data, error } = await supabase
    .from('scammers')
    .select('*')
    .eq('added_by', walletAddress)
    .is('deleted_at', null)
    .order('date_added', { ascending: false });
  
  if (error) {
    console.error('Error fetching scammers by reporter:', error);
    throw error;
  }
  
  return data || [];
};

// Get scammers liked by a user
export const getLikedScammersByUser = async (walletAddress: string): Promise<Scammer[]> => {
  console.log(`Fetching liked scammers for user: ${walletAddress}`);
  
  if (!walletAddress) {
    console.error('No wallet address provided to getLikedScammersByUser');
    return [];
  }
  
  try {
    // Get all the scammer IDs that this user has liked
    const { data: interactions, error: interactionsError } = await supabase
      .from('user_scammer_interactions')
      .select('scammer_id')
      .eq('user_id', walletAddress)
      .eq('liked', true);
    
    if (interactionsError) {
      console.error('Error fetching liked interactions:', interactionsError);
      throw interactionsError;
    }
    
    if (!interactions || interactions.length === 0) {
      console.log(`No liked scammers found for user: ${walletAddress}`);
      return [];
    }
    
    // Extract the scammer IDs from the interactions
    const scammerIds = interactions.map(interaction => interaction.scammer_id);
    console.log(`Found ${scammerIds.length} liked scammer IDs:`, scammerIds);
    
    // Fetch the full scammer details for each ID
    const { data: scammers, error: scammersError } = await supabase
      .from('scammers')
      .select('*')
      .in('id', scammerIds)
      .is('deleted_at', null);
    
    if (scammersError) {
      console.error('Error fetching scammers by ID:', scammersError);
      throw scammersError;
    }
    
    console.log(`Successfully fetched ${scammers?.length || 0} liked scammers`);
    return scammers || [];
  } catch (error) {
    console.error('Error in getLikedScammersByUser:', error);
    return [];
  }
};

/**
 * Soft deletes a scammer report by setting the deleted_at timestamp
 */
export const deleteScammer = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scammers')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting scammer:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception deleting scammer:', error);
    throw error;
  }
};
