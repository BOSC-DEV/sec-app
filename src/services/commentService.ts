
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/dataTypes';
import { notifyScammerComment } from '@/services/notificationService';

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
  author_profile_pic?: string,
  author_username?: string
}): Promise<Comment> => {
  console.log('Adding comment:', comment);
  
  // Validate that user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to add comments');
  }
  
  // Get the profile for the authenticated user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('wallet_address', user.email?.split('@')[0])
    .single();
  
  if (!profile) {
    throw new Error('Profile not found for authenticated user');
  }
  
  // Ensure the author matches the authenticated user's profile
  if (profile.id !== comment.author) {
    throw new Error('Cannot create comments for other users');
  }
  
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
      .select('comments, added_by, name')
      .eq('id', comment.scammer_id)
      .single();
      
    if (scammer) {
      const comments = [...(scammer.comments || []), id];
      await supabase
        .from('scammers')
        .update({ comments })
        .eq('id', comment.scammer_id);
        
      // Send notification to scammer creator if not the commenter
      if (scammer.added_by && scammer.added_by !== comment.author) {
        await notifyScammerComment(
          comment.scammer_id,
          scammer.name,
          id,
          scammer.added_by,
          comment.author,
          comment.author_name,
          comment.author_username,
          comment.author_profile_pic
        );
      }
    }
  } catch (e) {
    console.error('Error updating scammer comments array:', e);
    // Don't throw here - the comment was added successfully
  }
  
  return data;
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  // Validate that user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to delete comments');
  }
  
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  
  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
  
  return true;
};

export const updateComment = async (commentId: string, content: string): Promise<boolean> => {
  // Validate that user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to update comments');
  }
  
  const { error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId);
  
  if (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
  
  return true;
};
