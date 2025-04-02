import { supabase } from '@/integrations/supabase/client';
import { Comment, Profile, Scammer } from '@/types/dataTypes';

// Scammers Service
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

// Generate a sequential ID for a new scammer
export const generateScammerId = async (): Promise<string> => {
  // Get the highest scammer ID currently in the database
  const { data, error } = await supabase
    .from('scammers')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Error getting latest scammer ID:', error);
    throw error;
  }
  
  // If there are no scammers yet, start with 1
  if (!data || data.length === 0) {
    return '1';
  }
  
  try {
    // Extract the current highest ID and increment by 1
    const currentHighestId = data[0].id;
    // Handle both numeric and timestamp-based ids during transition
    const isNumeric = /^\d+$/.test(currentHighestId);
    
    if (isNumeric) {
      const nextId = (parseInt(currentHighestId, 10) + 1).toString();
      return nextId;
    } else {
      // If we still have old timestamp-based IDs, start the sequence from 1
      return '1';
    }
  } catch (e) {
    console.error('Error parsing scammer ID:', e);
    // Fallback to 1 if parsing fails
    return '1';
  }
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

// Comments Service
export const getScammerComments = async (scammerId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('scammer_id', scammerId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
  
  return data || [];
};

export const addComment = async (comment: {
  scammer_id: string,
  content: string,
  author: string,
  author_name: string,
  author_profile_pic?: string
}): Promise<Comment> => {
  console.log('Adding comment:', comment);
  
  // Generate a unique ID for the comment
  const id = `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  const { data, error } = await supabase
    .from('comments')
    .insert({
      id,
      scammer_id: comment.scammer_id,
      content: comment.content,
      author: comment.author,
      author_name: comment.author_name,
      author_profile_pic: comment.author_profile_pic,
      created_at: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      views: 0
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
  
  // Update the scammer's comments array with the new comment ID
  try {
    const { data: scammer } = await supabase
      .from('scammers')
      .select('comments')
      .eq('id', comment.scammer_id)
      .single();
      
    if (scammer) {
      const comments = [...(scammer.comments || []), id];
      await supabase
        .from('scammers')
        .update({ comments })
        .eq('id', comment.scammer_id);
    }
  } catch (e) {
    console.error('Error updating scammer comments array:', e);
    // Don't throw here - the comment was added successfully
  }
  
  return data;
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

// Interaction Service
export const likeScammer = async (scammerId: string, walletAddress: string): Promise<void> => {
  console.log(`Processing like for scammer ${scammerId} by user ${walletAddress}`);
  
  // Get existing interaction if any
  const { data: existingInteraction, error: fetchError } = await supabase
    .from('user_scammer_interactions')
    .select('*')
    .eq('scammer_id', scammerId)
    .eq('user_id', walletAddress)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching interaction:', fetchError);
    throw fetchError;
  }

  // Using a transaction to ensure atomic operations
  if (existingInteraction) {
    console.log('Existing interaction found:', existingInteraction);
    
    // Toggle like - if already liked, unlike it; if disliked, switch to like
    const liked = !existingInteraction.liked;
    const disliked = liked ? false : existingInteraction.disliked; // Can't be both liked and disliked
    
    const { error: updateError } = await supabase
      .from('user_scammer_interactions')
      .update({ 
        liked, 
        disliked,
        last_updated: new Date().toISOString() 
      })
      .eq('id', existingInteraction.id);
      
    if (updateError) {
      console.error('Error updating interaction:', updateError);
      throw updateError;
    }
    
    console.log(`Updated interaction: liked=${liked}, disliked=${disliked}`);
  } else {
    // No existing interaction, create new with liked=true
    console.log('No existing interaction, creating new one with liked=true');
    
    const { error: insertError } = await supabase
      .from('user_scammer_interactions')
      .insert({ 
        scammer_id: scammerId, 
        user_id: walletAddress, 
        liked: true, 
        disliked: false 
      });
      
    if (insertError) {
      console.error('Error inserting interaction:', insertError);
      throw insertError;
    }
  }

  // Update scammer like/dislike counts
  await updateScammerLikes(scammerId);
};

export const dislikeScammer = async (scammerId: string, walletAddress: string): Promise<void> => {
  // Get existing interaction if any
  const { data: existingInteraction } = await supabase
    .from('user_scammer_interactions')
    .select('*')
    .eq('scammer_id', scammerId)
    .eq('user_id', walletAddress)
    .maybeSingle();

  // Using a transaction to ensure atomic operations
  if (existingInteraction) {
    // Toggle dislike - if already disliked, un-dislike it; if liked, switch to dislike
    const disliked = !existingInteraction.disliked;
    const liked = disliked ? false : existingInteraction.liked; // Can't be both liked and disliked
    
    await supabase
      .from('user_scammer_interactions')
      .update({ 
        disliked,
        liked,
        last_updated: new Date().toISOString() 
      })
      .eq('id', existingInteraction.id);
  } else {
    // No existing interaction, create new with disliked=true
    await supabase
      .from('user_scammer_interactions')
      .insert({ 
        scammer_id: scammerId, 
        user_id: walletAddress, 
        disliked: true, 
        liked: false 
      });
  }

  // Update scammer like/dislike counts
  await updateScammerLikes(scammerId);
};

const updateScammerLikes = async (scammerId: string): Promise<void> => {
  console.log(`Updating like counts for scammer ${scammerId}`);
  
  // Count likes
  const { count: likeCount, error: likeError } = await supabase
    .from('user_scammer_interactions')
    .select('*', { count: 'exact', head: true })
    .eq('scammer_id', scammerId)
    .eq('liked', true);

  if (likeError) {
    console.error('Error counting likes:', likeError);
    return;
  }

  // Count dislikes
  const { count: dislikeCount, error: dislikeError } = await supabase
    .from('user_scammer_interactions')
    .select('*', { count: 'exact', head: true })
    .eq('scammer_id', scammerId)
    .eq('disliked', true);

  if (dislikeError) {
    console.error('Error counting dislikes:', dislikeError);
    return;
  }

  console.log(`New like count: ${likeCount}, new dislike count: ${dislikeCount}`);

  // Update scammer with new counts
  const { error: updateError } = await supabase
    .from('scammers')
    .update({ 
      likes: likeCount || 0, 
      dislikes: dislikeCount || 0 
    })
    .eq('id', scammerId);

  if (updateError) {
    console.error('Error updating scammer like/dislike counts:', updateError);
  } else {
    console.log(`Successfully updated scammer like/dislike counts`);
  }
};

// Statistics Service
export const getStatistics = async () => {
  try {
    // Get total bounty amount
    const { data: bountyData, error: bountyError } = await supabase
      .from('scammers')
      .select('bounty_amount')
      .is('deleted_at', null);
    
    if (bountyError) throw bountyError;
    
    const totalBounty = bountyData.reduce((sum, scammer) => sum + (scammer.bounty_amount || 0), 0);
    
    // Get total scammers count
    const { count: scammersCount, error: scammersError } = await supabase
      .from('scammers')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);
    
    if (scammersError) throw scammersError;
    
    // Get unique reporters count
    const { data: reportersData, error: reportersError } = await supabase
      .from('scammers')
      .select('added_by')
      .is('deleted_at', null);
    
    if (reportersError) throw reportersError;
    
    // Filter out null values and count unique reporters
    const uniqueReporters = new Set(reportersData.filter(item => item.added_by).map(item => item.added_by));
    const reportersCount = uniqueReporters.size;
    
    // Get total users count
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) throw usersError;
    
    return {
      totalBounty,
      scammersCount: scammersCount || 0,
      reportersCount,
      usersCount: usersCount || 0
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Return default values in case of error
    return {
      totalBounty: 0,
      scammersCount: 0,
      reportersCount: 0,
      usersCount: 0
    };
  }
};
