import { supabase } from '@/integrations/supabase/client';

export interface CommentReply {
  id: string;
  comment_id: string;
  author: string;
  author_name: string | null;
  author_profile_pic: string | null;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
}

export const commentReplyService = {
  // Fetch replies for a comment
  async fetchReplies(commentId: string): Promise<CommentReply[]> {
    const { data, error } = await supabase
      .from('comment_replies')
      .select('*')
      .eq('comment_id', commentId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }

    return data || [];
  },

  // Add a reply to a comment
  async addReply(
    commentId: string,
    content: string,
    authorId: string,
    authorName: string | null,
    authorProfilePic: string | null
  ): Promise<CommentReply> {
    const { data, error } = await supabase
      .from('comment_replies')
      .insert({
        comment_id: commentId,
        author: authorId,
        content,
        author_name: authorName,
        author_profile_pic: authorProfilePic,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding reply:', error);
      throw error;
    }

    return data;
  },

  // Toggle like/dislike on a reply
  async toggleReaction(
    replyId: string,
    userId: string,
    reactionType: 'like' | 'dislike'
  ): Promise<{ likes: number; dislikes: number }> {
    const { data, error } = await supabase.rpc('toggle_comment_reply_reaction', {
      p_reply_id: replyId,
      p_user_id: userId,
      p_reaction_type: reactionType,
    });

    if (error) {
      console.error('Error toggling reply reaction:', error);
      throw error;
    }

    return data as { likes: number; dislikes: number };
  },

  // Get user's reaction to a reply
  async getUserReaction(replyId: string, userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('comment_reply_reactions')
      .select('reaction_type')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user reaction:', error);
      return null;
    }

    return data?.reaction_type || null;
  },

  // Delete a reply
  async deleteReply(replyId: string): Promise<void> {
    const { error } = await supabase
      .from('comment_replies')
      .delete()
      .eq('id', replyId);

    if (error) {
      console.error('Error deleting reply:', error);
      throw error;
    }
  },
};
