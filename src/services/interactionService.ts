
import { supabase } from '@/integrations/supabase/client';
import { Scammer } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';

// Get scammers liked by a user
export const getLikedScammersByUser = async (walletAddress: string): Promise<Scammer[]> => {
  if (!walletAddress) {
    return [];
  }
  
  try {
    // Get all the scammer IDs that this user has liked
    const { data: interactions, error: interactionsError } = await supabase
      .from('user_scammer_interactions')
      .select('scammer_id')
      .eq('user_id', walletAddress)
      .eq('liked', true);
    
    if (interactionsError) throw interactionsError;
    
    if (!interactions || interactions.length === 0) {
      return [];
    }
    
    // Extract the scammer IDs from the interactions
    const scammerIds = interactions.map(interaction => interaction.scammer_id);
    
    // Fetch the full scammer details for each ID
    const { data: scammers, error: scammersError } = await supabase
      .from('scammers')
      .select('*')
      .in('id', scammerIds)
      .is('deleted_at', null);
    
    if (scammersError) throw scammersError;
    
    return scammers || [];
  } catch (error) {
    handleError(error, 'Error fetching liked scammers');
    return [];
  }
};

export const getUserScammerInteraction = async (scammerId: string, walletAddress: string): Promise<{ liked: boolean, disliked: boolean } | null> => {
  if (!walletAddress || !scammerId) return null;
  
  try {
    const { data, error } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('scammer_id', scammerId)
      .eq('user_id', walletAddress)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    handleError(error, 'Error fetching user interaction');
    return null;
  }
};

export const likeScammer = async (scammerId: string, walletAddress: string): Promise<{ likes: number; dislikes: number } | null> => {
  if (!walletAddress || !scammerId) return null;
  
  try {
    // Get existing interaction if any
    const { data: existingInteraction, error: fetchError } = await supabase
      .from('user_scammer_interactions')
      .select('*')
      .eq('scammer_id', scammerId)
      .eq('user_id', walletAddress)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Using a transaction to ensure atomic operations
    if (existingInteraction) {
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
        
      if (updateError) throw updateError;
    } else {
      // No existing interaction, create new with liked=true
      const { error: insertError } = await supabase
        .from('user_scammer_interactions')
        .insert({ 
          scammer_id: scammerId, 
          user_id: walletAddress, 
          liked: true, 
          disliked: false 
        });
        
      if (insertError) throw insertError;
    }

    // Always update scammer like/dislike counts and return the updated counts
    return await updateScammerLikes(scammerId);
  } catch (error) {
    handleError(error, 'Error updating scammer like');
    return null;
  }
};

export const dislikeScammer = async (scammerId: string, walletAddress: string): Promise<{ likes: number; dislikes: number } | null> => {
  if (!walletAddress || !scammerId) return null;
  
  try {
    // Get existing interaction if any
    const { data: existingInteraction, error: fetchError } = await supabase
      .from('user_scammer_interactions')
      .select('*')
      .eq('scammer_id', scammerId)
      .eq('user_id', walletAddress)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Using a transaction to ensure atomic operations
    if (existingInteraction) {
      // Toggle dislike - if already disliked, un-dislike it; if liked, switch to dislike
      const disliked = !existingInteraction.disliked;
      const liked = disliked ? false : existingInteraction.liked; // Can't be both liked and disliked
      
      const { error: updateError } = await supabase
        .from('user_scammer_interactions')
        .update({ 
          disliked,
          liked,
          last_updated: new Date().toISOString() 
        })
        .eq('id', existingInteraction.id);
        
      if (updateError) throw updateError;
    } else {
      // No existing interaction, create new with disliked=true
      const { error: insertError } = await supabase
        .from('user_scammer_interactions')
        .insert({ 
          scammer_id: scammerId, 
          user_id: walletAddress, 
          disliked: true, 
          liked: false 
        });
        
      if (insertError) throw insertError;
    }

    // Always update scammer like/dislike counts
    return await updateScammerLikes(scammerId);
  } catch (error) {
    handleError(error, 'Error updating scammer dislike');
    return null;
  }
};

const updateScammerLikes = async (scammerId: string): Promise<{ likes: number; dislikes: number }> => {
  try {
    // Count likes
    const { count: likeCount, error: likeError } = await supabase
      .from('user_scammer_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('scammer_id', scammerId)
      .eq('liked', true);

    if (likeError) throw likeError;

    // Count dislikes
    const { count: dislikeCount, error: dislikeError } = await supabase
      .from('user_scammer_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('scammer_id', scammerId)
      .eq('disliked', true);

    if (dislikeError) throw dislikeError;

    // Make sure counts are actual numbers, not null
    const likes = likeCount || 0;
    const dislikes = dislikeCount || 0;

    // Update scammer with new counts
    const { error: updateError } = await supabase
      .from('scammers')
      .update({ likes, dislikes })
      .eq('id', scammerId);

    if (updateError) throw updateError;
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error updating scammer likes/dislikes');
    // Return default 0 counts in case of error
    return { likes: 0, dislikes: 0 };
  }
};
