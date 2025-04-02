
import { supabase } from '@/integrations/supabase/client';
import { Scammer, Profile, Comment } from './mockData';

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
  
  // Increment view count
  if (data) {
    const { error: updateError } = await supabase
      .from('scammers')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating scammer views:', updateError);
    }
    
    // Log view in scammer_views table
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

export const addComment = async (comment: Partial<Comment>): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
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
  // First, check if there's an existing interaction
  const { data: existingInteraction } = await supabase
    .from('user_scammer_interactions')
    .select('*')
    .eq('scammer_id', scammerId)
    .eq('user_id', walletAddress)
    .maybeSingle();

  if (existingInteraction) {
    // Update existing interaction
    await supabase
      .from('user_scammer_interactions')
      .update({ 
        liked: !existingInteraction.liked, 
        disliked: existingInteraction.liked ? existingInteraction.disliked : false,
        last_updated: new Date().toISOString() 
      })
      .eq('id', existingInteraction.id);
  } else {
    // Create new interaction
    await supabase
      .from('user_scammer_interactions')
      .insert({ 
        scammer_id: scammerId, 
        user_id: walletAddress, 
        liked: true, 
        disliked: false 
      });
  }

  // Update scammer like counts
  await updateScammerLikes(scammerId);
};

export const dislikeScammer = async (scammerId: string, walletAddress: string): Promise<void> => {
  // First, check if there's an existing interaction
  const { data: existingInteraction } = await supabase
    .from('user_scammer_interactions')
    .select('*')
    .eq('scammer_id', scammerId)
    .eq('user_id', walletAddress)
    .maybeSingle();

  if (existingInteraction) {
    // Update existing interaction
    await supabase
      .from('user_scammer_interactions')
      .update({ 
        disliked: !existingInteraction.disliked, 
        liked: existingInteraction.disliked ? existingInteraction.liked : false,
        last_updated: new Date().toISOString() 
      })
      .eq('id', existingInteraction.id);
  } else {
    // Create new interaction
    await supabase
      .from('user_scammer_interactions')
      .insert({ 
        scammer_id: scammerId, 
        user_id: walletAddress, 
        disliked: true, 
        liked: false 
      });
  }

  // Update scammer dislike counts
  await updateScammerLikes(scammerId);
};

// Helper function to update scammer like/dislike counts
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

  // Update scammer record
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

// Data Seeding Function
export const seedInitialData = async () => {
  try {
    const { data: existingScammers } = await supabase
      .from('scammers')
      .select('id')
      .limit(1);
    
    // If data already exists, don't seed
    if (existingScammers && existingScammers.length > 0) {
      console.log('Data already exists, skipping seed');
      return;
    }

    // Load initial data
    const { mockScammers, mockProfiles, mockComments } = await import('./mockData');
    
    // Insert profiles
    const { error: profilesError } = await supabase
      .from('profiles')
      .insert(mockProfiles);
    
    if (profilesError) {
      console.error('Error seeding profiles:', profilesError);
    }
    
    // Insert scammers
    const { error: scammersError } = await supabase
      .from('scammers')
      .insert(mockScammers);
    
    if (scammersError) {
      console.error('Error seeding scammers:', scammersError);
    }
    
    // Insert comments
    const { error: commentsError } = await supabase
      .from('comments')
      .insert(mockComments);
    
    if (commentsError) {
      console.error('Error seeding comments:', commentsError);
    }
    
    console.log('Initial data seeded successfully');
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};
