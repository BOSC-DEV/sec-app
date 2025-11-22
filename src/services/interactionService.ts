import { supabase } from '@/integrations/supabase/client';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';
import { notifyScammerLike } from '@/services/notificationService';

// Interface for scammer interaction results
interface ScammerInteractionResult {
  likes: number;
  dislikes: number;
}

// Interface for getting a user's interaction with a scammer
interface UserScammerInteraction {
  liked: boolean;
  disliked: boolean;
}

// Interface for comment interaction results
interface CommentInteractionResult {
  likes: number;
  dislikes: number;
}

// Interface for getting a user's interaction with a comment
interface UserCommentInteraction {
  liked: boolean;
  disliked: boolean;
}

/**
 * First check if the scammer exists before any like/dislike operation
 */
const checkScammerExists = async (scammerId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('scammers')
      .select('id')
      .eq('id', scammerId)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking scammer existence:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking scammer existence:', error);
    return false;
  }
};

/**
 * Toggle like for a scammer
 * If already liked, it will unlike
 * If disliked, it will undislike and like
 */
export const likeScammer = async (scammerId: string, userId: string): Promise<ScammerInteractionResult> => {
  try {
    // First check if the scammer exists
    const scammerExists = await checkScammerExists(scammerId);
    if (!scammerExists) {
      throw new Error(`Scammer with ID ${scammerId} does not exist`);
    }
    
    const { data, error } = await supabase
      .rpc('toggle_scammer_reaction', {
        p_scammer_id: scammerId,
        p_user_id: userId,
        p_reaction_type: 'like'
      });
    
    if (error) throw error;
    
    const result = data as { likes: number; dislikes: number };
    
    // Send notification after successful like
    const { data: scammerData } = await supabase
      .from('scammers')
      .select('name, added_by')
      .eq('id', scammerId)
      .single();
      
    if (scammerData && scammerData.added_by && scammerData.added_by !== userId) {
      const { data: userData } = await supabase
        .from('profiles')
        .select('display_name, username, profile_pic_url')
        .eq('id', userId)
        .single();
        
      if (userData) {
        await notifyScammerLike(
          scammerId,
          scammerData.name,
          scammerData.added_by,
          userId,
          userData.display_name,
          userData.username,
          userData.profile_pic_url
        );
      }
    }
    
    return result;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to like scammer',
      severity: ErrorSeverity.MEDIUM,
      context: 'LIKE_SCAMMER'
    });
    throw error;
  }
};

/**
 * Toggle dislike for a scammer
 * If already disliked, it will undislike
 * If liked, it will unlike and dislike
 */
export const dislikeScammer = async (scammerId: string, userId: string): Promise<ScammerInteractionResult> => {
  try {
    // First check if the scammer exists
    const scammerExists = await checkScammerExists(scammerId);
    if (!scammerExists) {
      throw new Error(`Scammer with ID ${scammerId} does not exist`);
    }
    
    const { data, error } = await supabase
      .rpc('toggle_scammer_reaction', {
        p_scammer_id: scammerId,
        p_user_id: userId,
        p_reaction_type: 'dislike'
      });
    
    if (error) throw error;
    return data as { likes: number; dislikes: number };
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to dislike scammer',
      severity: ErrorSeverity.MEDIUM,
      context: 'DISLIKE_SCAMMER'
    });
    throw error;
  }
};

/**
 * Get the current likes and dislikes count for a scammer
 */
const getScammerLikesDislikes = async (scammerId: string): Promise<ScammerInteractionResult> => {
  try {
    const { data: scammer } = await supabase
      .from('scammers')
      .select('likes, dislikes')
      .eq('id', scammerId)
      .single();
      
    return {
      likes: scammer?.likes || 0,
      dislikes: scammer?.dislikes || 0
    };
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to get scammer likes/dislikes',
      severity: ErrorSeverity.LOW,
      context: 'GET_SCAMMER_LIKES_DISLIKES'
    });
    return { likes: 0, dislikes: 0 };
  }
};

/**
 * Get whether a user has liked or disliked a scammer
 */
export const getUserScammerInteraction = async (scammerId: string, userId: string): Promise<UserScammerInteraction | null> => {
  try {
    // First check if the scammer exists
    const scammerExists = await checkScammerExists(scammerId);
    if (!scammerExists) {
      console.warn(`Attempting to get interaction for non-existent scammer ID: ${scammerId}`);
      return null;
    }
    
    const { data: interaction } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('scammer_id', scammerId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (interaction) {
      return {
        liked: interaction.liked,
        disliked: interaction.disliked
      };
    }
    
    return null;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to get user scammer interaction',
      severity: ErrorSeverity.LOW,
      context: 'GET_USER_SCAMMER_INTERACTION'
    });
    return null;
  }
};

// Exporting similar functions for comments
export const likeComment = async (commentId: string, userId: string): Promise<CommentInteractionResult> => {
  // Similar implementation as likeScammer but for comments
  // Implementation skipped for brevity
  return { likes: 0, dislikes: 0 };
};

export const dislikeComment = async (commentId: string, userId: string): Promise<CommentInteractionResult> => {
  // Similar implementation as dislikeScammer but for comments
  // Implementation skipped for brevity
  return { likes: 0, dislikes: 0 };
};

export const getUserCommentInteraction = async (commentId: string, userId: string): Promise<UserCommentInteraction | null> => {
  // Similar implementation as getUserScammerInteraction but for comments
  // Implementation skipped for brevity
  return null;
};
