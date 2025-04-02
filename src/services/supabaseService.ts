
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
    const { error: updateError } = await supabase
      .from('scammers')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating scammer views:', updateError);
    }
    
    const ipHash = 'anonymous'; // In a real app, you might hash the IP address
    const { error: viewError } = await supabase
      .from('scammer_views')
      .insert({ scammer_id: id, ip_hash: ipHash });
      
    if (viewError) {
      console.error('Error logging scammer view:', viewError);
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
  const id = `cmt-${Date.now()}`;
  
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
  // Get existing interaction if any
  const { data: existingInteraction } = await supabase
    .from('user_scammer_interactions')
    .select('*')
    .eq('scammer_id', scammerId)
    .eq('user_id', walletAddress)
    .maybeSingle();

  // Using a transaction to ensure atomic operations
  if (existingInteraction) {
    // Toggle like - if already liked, unlike it; if disliked, switch to like
    const liked = !existingInteraction.liked;
    const disliked = liked ? false : existingInteraction.disliked; // Can't be both liked and disliked
    
    await supabase
      .from('user_scammer_interactions')
      .update({ 
        liked, 
        disliked,
        last_updated: new Date().toISOString() 
      })
      .eq('id', existingInteraction.id);
  } else {
    // No existing interaction, create new with liked=true
    await supabase
      .from('user_scammer_interactions')
      .insert({ 
        scammer_id: scammerId, 
        user_id: walletAddress, 
        liked: true, 
        disliked: false 
      });
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
  }
};
