
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';

export const getScammerComments = async (scammerId: string): Promise<Comment[]> => {
  if (!scammerId) return [];
  
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('scammer_id', scammerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    handleError(error, 'Error fetching comments');
    return [];
  }
};

export const addComment = async (comment: {
  scammer_id: string,
  content: string,
  author: string,
  author_name: string,
  author_profile_pic?: string
}): Promise<Comment | null> => {
  try {
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
    
    if (error) throw error;
    
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
  } catch (error) {
    handleError(error, 'Error adding comment');
    return null;
  }
};
