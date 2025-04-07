
import { supabase } from '@/integrations/supabase/client';

export const getUserScammerInteraction = async (scammerId: string, walletAddress: string): Promise<{ liked: boolean, disliked: boolean } | null> => {
  if (!walletAddress) return null;
  
  try {
    console.log(`Fetching interaction for scammer ${scammerId} by user ${walletAddress}`);
    
    const { data, error } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('scammer_id', scammerId)
      .eq('user_id', walletAddress)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user interaction:', error);
      return null;
    }

    console.log('Found interaction:', data);
    return data;
  } catch (err) {
    console.error('Exception in getUserScammerInteraction:', err);
    return null;
  }
};

export const likeScammer = async (scammerId: string, walletAddress: string): Promise<{ likes: number; dislikes: number } | void> => {
  if (!walletAddress) {
    console.error('No wallet address provided for likeScammer');
    return;
  }
  if (!scammerId) {
    console.error('No scammer ID provided for likeScammer');
    return;
  }
  
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

  try {
    // Using a transaction to ensure atomic operations
    if (existingInteraction) {
      console.log('Existing interaction found:', existingInteraction);
      
      // Toggle like - if already liked, unlike it; if disliked, switch to like
      const liked = !existingInteraction.liked;
      const disliked = liked ? false : existingInteraction.disliked; // Can't be both liked and disliked
      
      console.log(`Updating interaction: liked=${liked}, disliked=${disliked}`);
      
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
      
      const { data: newInteraction, error: insertError } = await supabase
        .from('user_scammer_interactions')
        .insert({ 
          scammer_id: scammerId, 
          user_id: walletAddress, 
          liked: true, 
          disliked: false 
        })
        .select();
        
      if (insertError) {
        console.error('Error inserting interaction:', insertError);
        throw insertError;
      }
      
      console.log('Created new interaction:', newInteraction);
    }

    // Always update scammer like/dislike counts and return the updated counts
    const updatedCounts = await updateScammerLikes(scammerId);
    
    console.log('Updated scammer counts:', updatedCounts);
    return updatedCounts;
  } catch (error) {
    console.error('Error in likeScammer:', error);
    throw error;
  }
};

export const dislikeScammer = async (scammerId: string, walletAddress: string): Promise<{ likes: number; dislikes: number } | void> => {
  if (!walletAddress) {
    console.error('No wallet address provided for dislikeScammer');
    return;
  }
  if (!scammerId) {
    console.error('No scammer ID provided for dislikeScammer');
    return;
  }
  
  console.log(`Processing dislike for scammer ${scammerId} by user ${walletAddress}`);
  
  try {
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
      
      // Toggle dislike - if already disliked, un-dislike it; if liked, switch to dislike
      const disliked = !existingInteraction.disliked;
      const liked = disliked ? false : existingInteraction.liked; // Can't be both liked and disliked
      
      console.log(`Updating interaction: disliked=${disliked}, liked=${liked}`);
      
      const { error: updateError } = await supabase
        .from('user_scammer_interactions')
        .update({ 
          disliked,
          liked,
          last_updated: new Date().toISOString() 
        })
        .eq('id', existingInteraction.id);
        
      if (updateError) {
        console.error('Error updating interaction:', updateError);
        throw updateError;
      }
      
      console.log(`Updated interaction: disliked=${disliked}, liked=${liked}`);
    } else {
      // No existing interaction, create new with disliked=true
      console.log('No existing interaction, creating new one with disliked=true');
      
      const { data: newInteraction, error: insertError } = await supabase
        .from('user_scammer_interactions')
        .insert({ 
          scammer_id: scammerId, 
          user_id: walletAddress, 
          disliked: true, 
          liked: false 
        })
        .select();
        
      if (insertError) {
        console.error('Error inserting interaction:', insertError);
        throw insertError;
      }
      
      console.log('Created new interaction:', newInteraction);
    }

    // Always update scammer like/dislike counts
    const updatedCounts = await updateScammerLikes(scammerId);
    
    console.log('Updated scammer counts:', updatedCounts);
    return updatedCounts;
  } catch (error) {
    console.error('Error in dislikeScammer:', error);
    throw error;
  }
};

const updateScammerLikes = async (scammerId: string): Promise<{ likes: number; dislikes: number }> => {
  console.log(`Updating like counts for scammer ${scammerId}`);
  
  try {
    // Count likes
    const { count: likeCount, error: likeError } = await supabase
      .from('user_scammer_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('scammer_id', scammerId)
      .eq('liked', true);

    if (likeError) {
      console.error('Error counting likes:', likeError);
      throw likeError;
    }

    // Count dislikes
    const { count: dislikeCount, error: dislikeError } = await supabase
      .from('user_scammer_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('scammer_id', scammerId)
      .eq('disliked', true);

    if (dislikeError) {
      console.error('Error counting dislikes:', dislikeError);
      throw dislikeError;
    }

    // Make sure counts are actual numbers, not null
    const likes = likeCount || 0;
    const dislikes = dislikeCount || 0;

    console.log(`New like count: ${likes}, new dislike count: ${dislikes}`);

    // Debug: Log the scammer ID and the update values for debugging
    console.log(`Attempting to update scammer ID: ${scammerId} with likes: ${likes}, dislikes: ${dislikes}`);
    
    // Fetch the scammer first to verify it exists
    const { data: existingScammer, error: fetchError } = await supabase
      .from('scammers')
      .select('id, likes, dislikes')
      .eq('id', scammerId)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching scammer with ID ${scammerId}:`, fetchError);
      throw fetchError;
    }
    
    console.log(`Found existing scammer:`, existingScammer);
    
    // Explicitly update likes and dislikes as numbers
    const { data: updateData, error: updateError } = await supabase
      .from('scammers')
      .update({ 
        likes: likes, 
        dislikes: dislikes 
      })
      .eq('id', scammerId)
      .select();

    if (updateError) {
      console.error('Error updating scammer like/dislike counts:', updateError);
      throw updateError;
    } 
    
    console.log(`Successfully updated scammer like/dislike counts:`, updateData);
    
    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('scammers')
      .select('likes, dislikes')
      .eq('id', scammerId)
      .single();
      
    if (verifyError) {
      console.error('Error verifying update:', verifyError);
    } else {
      console.log('Verified scammer data after update:', verifyData);
    }
    
    return { likes, dislikes };
  } catch (error) {
    console.error('Error in updateScammerLikes:', error);
    // Return default 0 counts in case of error
    return { likes: 0, dislikes: 0 };
  }
};
