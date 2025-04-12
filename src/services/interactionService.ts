import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';
import { 
  notifyScammerLike, 
  notifyScammerComment, 
  notifyReaction 
} from '@/services/notificationService';
import { EntityType } from '@/types/dataTypes';

// Toggle like on a scammer post
export const toggleScammerLike = async (
  scammerId: string, 
  userId: string, 
  userName: string,
  userUsername?: string,
  userProfilePic?: string
) => {
  try {
    // First check if user has already interacted with this scammer
    const { data: existingInteraction } = await supabase
      .from('user_scammer_interactions')
      .select('id, liked, disliked, scammer_id')
      .eq('user_id', userId)
      .eq('scammer_id', scammerId)
      .maybeSingle();

    // Get the scammer details for notification
    const { data: scammer } = await supabase
      .from('scammers')
      .select('name, added_by')
      .eq('id', scammerId)
      .single();
    
    if (existingInteraction) {
      // User has already interacted with this scammer
      const wasLiked = existingInteraction.liked;
      
      // Update existing interaction
      const { error } = await supabase
        .from('user_scammer_interactions')
        .update({
          liked: !wasLiked,
          disliked: false // Reset dislike if setting like
        })
        .eq('id', existingInteraction.id);
        
      if (error) {
        throw error;
      }
      
      // Update scammer likes count
      if (wasLiked) {
        // User is un-liking the scammer
        await supabase.rpc('decrement_scammer_likes', { scammer_id: scammerId });
      } else {
        // User is liking the scammer
        await supabase.rpc('increment_scammer_likes', { scammer_id: scammerId });
        
        // Decrement dislikes if it was disliked
        if (existingInteraction.disliked) {
          await supabase.rpc('decrement_scammer_dislikes', { scammer_id: scammerId });
        }
        
        // Send notification to the scammer creator
        if (scammer && scammer.added_by && scammer.added_by !== userId) {
          await notifyScammerLike(
            scammerId,
            scammer.name,
            scammer.added_by,
            userId,
            userName,
            userUsername,
            userProfilePic
          );
        }
      }
      
      return !wasLiked;
    } else {
      // First interaction with this scammer
      const { error } = await supabase
        .from('user_scammer_interactions')
        .insert({
          user_id: userId,
          scammer_id: scammerId,
          liked: true,
          disliked: false
        });
        
      if (error) {
        throw error;
      }
      
      // Increment scammer likes count
      await supabase.rpc('increment_scammer_likes', { scammer_id: scammerId });
      
      // Send notification to the scammer creator
      if (scammer && scammer.added_by && scammer.added_by !== userId) {
        await notifyScammerLike(
          scammerId,
          scammer.name,
          scammer.added_by,
          userId,
          userName,
          userUsername,
          userProfilePic
        );
      }
      
      return true;
    }
  } catch (error) {
    handleError(error, 'Error toggling scammer like');
    return false;
  }
};

// Toggle dislike on a scammer post
export const toggleScammerDislike = async (scammerId: string, userId: string) => {
  try {
    // First check if user has already interacted with this scammer
    const { data: existingInteraction } = await supabase
      .from('user_scammer_interactions')
      .select('id, liked, disliked')
      .eq('user_id', userId)
      .eq('scammer_id', scammerId)
      .maybeSingle();
    
    if (existingInteraction) {
      // User has already interacted with this scammer
      const wasDisliked = existingInteraction.disliked;
      
      // Update existing interaction
      const { error } = await supabase
        .from('user_scammer_interactions')
        .update({
          disliked: !wasDisliked,
          liked: false // Reset like if setting dislike
        })
        .eq('id', existingInteraction.id);
        
      if (error) {
        throw error;
      }
      
      // Update scammer dislikes count
      if (wasDisliked) {
        // User is un-disliking the scammer
        await supabase.rpc('decrement_scammer_dislikes', { scammer_id: scammerId });
      } else {
        // User is disliking the scammer
        await supabase.rpc('increment_scammer_dislikes', { scammer_id: scammerId });
        
        // Decrement likes if it was liked
        if (existingInteraction.liked) {
          await supabase.rpc('decrement_scammer_likes', { scammer_id: scammerId });
        }
      }
      
      return !wasDisliked;
    } else {
      // First interaction with this scammer
      const { error } = await supabase
        .from('user_scammer_interactions')
        .insert({
          user_id: userId,
          scammer_id: scammerId,
          liked: false,
          disliked: true
        });
        
      if (error) {
        throw error;
      }
      
      // Increment scammer dislikes count
      await supabase.rpc('increment_scammer_dislikes', { scammer_id: scammerId });
      
      return true;
    }
  } catch (error) {
    handleError(error, 'Error toggling scammer dislike');
    return false;
  }
};

// Toggle like on a comment
export const toggleCommentLike = async (
  commentId: string, 
  userId: string,
  userName: string,
  userUsername?: string,
  userProfilePic?: string
) => {
  try {
    // First check if user has already interacted with this comment
    const { data: existingInteraction } = await supabase
      .from('user_comment_interactions')
      .select('id, liked, disliked')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .maybeSingle();
    
    // Get the comment details for notification
    const { data: comment } = await supabase
      .from('comments')
      .select('author, content, scammer_id')
      .eq('id', commentId)
      .single();
    
    if (existingInteraction) {
      // User has already interacted with this comment
      const wasLiked = existingInteraction.liked;
      
      // Update existing interaction
      const { error } = await supabase
        .from('user_comment_interactions')
        .update({
          liked: !wasLiked,
          disliked: false // Reset dislike if setting like
        })
        .eq('id', existingInteraction.id);
        
      if (error) {
        throw error;
      }
      
      // Update comment likes count
      if (wasLiked) {
        // User is un-liking the comment
        await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
      } else {
        // User is liking the comment
        await supabase.rpc('increment_comment_likes', { comment_id: commentId });
        
        // Decrement dislikes if it was disliked
        if (existingInteraction.disliked) {
          await supabase.rpc('decrement_comment_dislikes', { comment_id: commentId });
        }
        
        // Send notification to comment author
        if (comment && comment.author && comment.author !== userId) {
          await notifyReaction(
            commentId,
            EntityType.COMMENT,
            comment.content.substring(0, 30) + '...',
            '👍',
            comment.author,
            userId,
            userName,
            userUsername,
            userProfilePic
          );
        }
      }
      
      return !wasLiked;
    } else {
      // First interaction with this comment
      const { error } = await supabase
        .from('user_comment_interactions')
        .insert({
          user_id: userId,
          comment_id: commentId,
          liked: true,
          disliked: false
        });
        
      if (error) {
        throw error;
      }
      
      // Increment comment likes count
      await supabase.rpc('increment_comment_likes', { comment_id: commentId });
      
      // Send notification to comment author
      if (comment && comment.author && comment.author !== userId) {
        await notifyReaction(
          commentId,
          EntityType.COMMENT,
          comment.content.substring(0, 30) + '...',
          '👍',
          comment.author,
          userId,
          userName,
          userUsername,
          userProfilePic
        );
      }
      
      return true;
    }
  } catch (error) {
    handleError(error, 'Error toggling comment like');
    return false;
  }
};

// Toggle dislike on a comment
export const toggleCommentDislike = async (commentId: string, userId: string) => {
  try {
    // First check if user has already interacted with this comment
    const { data: existingInteraction } = await supabase
      .from('user_comment_interactions')
      .select('id, liked, disliked')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .maybeSingle();
    
    if (existingInteraction) {
      // User has already interacted with this comment
      const wasDisliked = existingInteraction.disliked;
      
      // Update existing interaction
      const { error } = await supabase
        .from('user_comment_interactions')
        .update({
          disliked: !wasDisliked,
          liked: false // Reset like if setting dislike
        })
        .eq('id', existingInteraction.id);
        
      if (error) {
        throw error;
      }
      
      // Update comment dislikes count
      if (wasDisliked) {
        // User is un-disliking the comment
        await supabase.rpc('decrement_comment_dislikes', { comment_id: commentId });
      } else {
        // User is disliking the comment
        await supabase.rpc('increment_comment_dislikes', { comment_id: commentId });
        
        // Decrement likes if it was liked
        if (existingInteraction.liked) {
          await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
        }
      }
      
      return !wasDisliked;
    } else {
      // First interaction with this comment
      const { error } = await supabase
        .from('user_comment_interactions')
        .insert({
          user_id: userId,
          comment_id: commentId,
          liked: false,
          disliked: true
        });
        
      if (error) {
        throw error;
      }
      
      // Increment comment dislikes count
      await supabase.rpc('increment_comment_dislikes', { comment_id: commentId });
      
      return true;
    }
  } catch (error) {
    handleError(error, 'Error toggling comment dislike');
    return false;
  }
};

// Check if user has liked a scammer post
export const hasUserLikedScammer = async (scammerId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_scammer_interactions')
      .select('liked')
      .eq('user_id', userId)
      .eq('scammer_id', scammerId)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data?.liked || false;
  } catch (error) {
    handleError(error, 'Error checking if user liked scammer');
    return false;
  }
};

// Check if user has disliked a scammer post
export const hasUserDislikedScammer = async (scammerId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_scammer_interactions')
      .select('disliked')
      .eq('user_id', userId)
      .eq('scammer_id', scammerId)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data?.disliked || false;
  } catch (error) {
    handleError(error, 'Error checking if user disliked scammer');
    return false;
  }
};

// Check if user has liked a comment
export const hasUserLikedComment = async (commentId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_comment_interactions')
      .select('liked')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data?.liked || false;
  } catch (error) {
    handleError(error, 'Error checking if user liked comment');
    return false;
  }
};

// Check if user has disliked a comment
export const hasUserDislikedComment = async (commentId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_comment_interactions')
      .select('disliked')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data?.disliked || false;
  } catch (error) {
    handleError(error, 'Error checking if user disliked comment');
    return false;
  }
};

// Get user's interaction with a scammer
export const getUserScammerInteraction = async (scammerId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('user_id', userId)
      .eq('scammer_id', scammerId)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data || null;
  } catch (error) {
    handleError(error, 'Error getting user scammer interaction');
    return null;
  }
};

// Wrapper functions for like/dislike to simplify the API
export const likeScammer = async (scammerId: string, userId: string): Promise<any> => {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, username, profile_pic_url')
      .eq('wallet_address', userId)
      .single();
    
    // Check existing interaction
    const { data: interaction } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('user_id', userId)
      .eq('scammer_id', scammerId)
      .maybeSingle();
    
    const isLiked = interaction?.liked || false;
    
    // Toggle like
    await toggleScammerLike(
      scammerId, 
      userId, 
      profile?.display_name || 'Anonymous',
      profile?.username,
      profile?.profile_pic_url
    );
    
    // Get updated scammer stats
    const { data: scammer } = await supabase
      .from('scammers')
      .select('likes, dislikes')
      .eq('id', scammerId)
      .single();
    
    return scammer;
  } catch (error) {
    handleError(error, 'Error liking scammer');
    throw error;
  }
};

export const dislikeScammer = async (scammerId: string, userId: string): Promise<any> => {
  try {
    // Toggle dislike
    await toggleScammerDislike(scammerId, userId);
    
    // Get updated scammer stats
    const { data: scammer } = await supabase
      .from('scammers')
      .select('likes, dislikes')
      .eq('id', scammerId)
      .single();
    
    return scammer;
  } catch (error) {
    handleError(error, 'Error disliking scammer');
    throw error;
  }
};
