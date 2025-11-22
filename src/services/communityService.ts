import { supabase } from '@/integrations/supabase/client';
import { Announcement, AnnouncementReply, SurveyData, SurveyVoter } from '@/types/dataTypes';
import { isAdmin } from '@/utils/adminUtils';

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to ensure proper typing for survey_data
    return (data || []).map(item => {
      // Cast the survey_data to SurveyData or null
      const surveyData = item.survey_data ? 
        (item.survey_data as unknown as SurveyData) : 
        null;
      
      return {
        ...item,
        survey_data: surveyData
      } as Announcement;
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
};

export const isUserAdmin = async (username: string): Promise<boolean> => {
  // First check the hardcoded admin list for performance
  if (isAdmin(username)) {
    return true;
  }
  
  // Check the database for dynamic admin management
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user session:', userError);
      return false;
    }
    
    if (!user) {
      console.warn('No backend session found - user needs to reconnect wallet to authenticate');
      return false;
    }
    
    // Check if this user has admin role in user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (roleError) {
      console.error('Error checking user role:', roleError);
      return false;
    }
    
    return !!roleData;
  } catch (error) {
    console.error('Error checking if user is admin:', error);
    return false;
  }
};

export const createAnnouncement = async (announcement: {
  content: string;
  author_id: string;
  author_name: string;
  author_username?: string;
  author_profile_pic?: string;
  likes: number;
  dislikes: number;
  image_url?: string;
}): Promise<Announcement | null> => {
  try {
    // Create a modified announcement object ensuring author_username is present
    const modifiedAnnouncement = {
      ...announcement,
      author_username: announcement.author_username || '',
    };
    
    const { data, error } = await supabase
      .from('announcements')
      .insert(modifiedAnnouncement)
      .select()
      .single();
      
    if (error) throw error;
    
    // Handle potential survey_data in response
    const result = {
      ...data,
      survey_data: data.survey_data ? (data.survey_data as unknown as SurveyData) : null
    } as Announcement;
    
    return result;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const incrementAnnouncementViews = async (announcementId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_announcement_views', {
      announcement_id_param: announcementId
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing announcement views:', error);
  }
};

export const deleteAnnouncement = async (announcementId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return false;
  }
};

export const editAnnouncement = async (announcementId: string, content: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .update({ content })
      .eq('id', announcementId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error editing announcement:', error);
    return false;
  }
};

export const createSurveyAnnouncement = async (
  title: string,
  options: string[],
  announcement: {
    author_id: string;
    author_name: string;
    author_username?: string;
    author_profile_pic?: string;
    likes: number;
    dislikes: number;
    image_url?: string;
  }
): Promise<Announcement | null> => {
  try {
    // Create options structure with initial empty votes
    const surveyOptions = options.map(option => ({
      text: option,
      votes: 0,
      voters: []
    }));
    
    const surveyData: SurveyData = {
      title,
      options: surveyOptions
    };
    
    // Create a modified announcement object with author_username as a required field
    const modifiedAnnouncement = {
      ...announcement,
      content: `<p>${title}</p>`,
      survey_data: surveyData as any, // Cast to any to avoid type issues with Json
      author_username: announcement.author_username || '',
    };
    
    const { data, error } = await supabase
      .from('announcements')
      .insert(modifiedAnnouncement)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      survey_data: data.survey_data as unknown as SurveyData
    } as Announcement;
  } catch (error) {
    console.error('Error creating survey announcement:', error);
    throw error;
  }
};

export const voteSurvey = async (
  announcementId: string,
  optionIndex: number,
  userId: string,
  badgeTier: string,
  displayName?: string,
  username?: string
): Promise<boolean> => {
  try {
    // Get the current announcement
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('survey_data')
      .eq('id', announcementId)
      .single();
      
    if (fetchError) throw fetchError;
    if (!announcement || !announcement.survey_data) return false;
    
    // Cast survey_data to the correct type
    const surveyData = announcement.survey_data as unknown as SurveyData;
    
    // Check if survey data structure is valid
    if (!surveyData.options || !Array.isArray(surveyData.options)) {
      throw new Error('Invalid survey data structure');
    }
    
    const options = surveyData.options;
    
    if (optionIndex < 0 || optionIndex >= options.length) {
      throw new Error('Invalid option index');
    }
    
    // Check if user has already voted for a different option
    let userPreviousVote = -1;
    for (let i = 0; i < options.length; i++) {
      if (!options[i].voters) {
        options[i].voters = [];
        continue;
      }
      
      const voterIndex = options[i].voters.findIndex((voter) => voter.userId === userId);
      if (voterIndex !== -1) {
        userPreviousVote = i;
        // Remove the user's previous vote
        options[i].votes -= 1;
        options[i].voters.splice(voterIndex, 1);
        break;
      }
    }
    
    // If voting for the same option (toggle vote off), just save the updated data
    if (userPreviousVote === optionIndex) {
      const { error: updateError } = await supabase
        .from('announcements')
        .update({ survey_data: surveyData as any }) // Cast to any to avoid type issues
        .eq('id', announcementId);
        
      if (updateError) throw updateError;
      return true;
    }
    
    // Add the user's vote to the selected option
    options[optionIndex].votes += 1;
    
    // Create voter object with correct properties (no timestamp)
    const voterData: SurveyVoter = {
      userId,
      badgeTier,
      username,
      displayName
    };
    
    options[optionIndex].voters.push(voterData);
    
    // Update the announcement
    const { error: updateError } = await supabase
      .from('announcements')
      .update({ survey_data: surveyData as any }) // Cast to any to avoid type issues
      .eq('id', announcementId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error voting in survey:', error);
    return false;
  }
};

export const getUserSurveyVote = async (
  announcementId: string,
  userId: string
): Promise<number | undefined> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('survey_data')
      .eq('id', announcementId)
      .single();
      
    if (error) throw error;
    if (!data || !data.survey_data) return undefined;
    
    // Cast to SurveyData type
    const surveyData = data.survey_data as unknown as SurveyData;
    
    if (!surveyData.options || !Array.isArray(surveyData.options)) {
      return undefined;
    }
    
    const options = surveyData.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].voters && Array.isArray(options[i].voters) && 
          options[i].voters.some((voter) => voter.userId === userId)) {
        return i;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting user survey vote:', error);
    return undefined;
  }
};

// Announcement-reply related functions
export const getAnnouncementReplies = async (announcementId: string): Promise<AnnouncementReply[]> => {
  try {
    const { data, error } = await supabase
      .from('replies')
      .select('*')
      .eq('announcement_id', announcementId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data as AnnouncementReply[];
  } catch (error) {
    console.error('Error fetching announcement replies:', error);
    return [];
  }
};

export const addAnnouncementReply = async (reply: {
  announcement_id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_username?: string;
  author_profile_pic?: string;
  likes: number;
  dislikes: number;
}): Promise<AnnouncementReply | null> => {
  try {
    const { data, error } = await supabase
      .from('replies')
      .insert({
        ...reply,
        author_username: reply.author_username || null
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as AnnouncementReply;
  } catch (error) {
    console.error('Error adding announcement reply:', error);
    return null;
  }
};

export const deleteAnnouncementReply = async (replyId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    // Check if user is admin or owns the reply
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('wallet_address', user.id)
      .single();

    const { data: reply } = await supabase
      .from('replies')
      .select('author_id')
      .eq('id', replyId)
      .single();

    if (!profile?.is_admin && reply?.author_id !== user.id) {
      throw new Error('Unauthorized to delete this reply');
    }

    const { error } = await supabase
      .from('replies')
      .delete()
      .eq('id', replyId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting announcement reply:', error);
    return false;
  }
};

export const editAnnouncementReply = async (replyId: string, content: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    // Check if user is admin or owns the reply
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('wallet_address', user.id)
      .single();

    const { data: reply } = await supabase
      .from('replies')
      .select('author_id')
      .eq('id', replyId)
      .single();

    if (!profile?.is_admin && reply?.author_id !== user.id) {
      throw new Error('Unauthorized to edit this reply');
    }

    const { error } = await supabase
      .from('replies')
      .update({ content })
      .eq('id', replyId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error editing announcement reply:', error);
    return false;
  }
};

// Like/dislike functions for announcements
export const likeAnnouncement = async (announcementId: string, userId: string) => {
  const { data, error } = await supabase
    .rpc('toggle_announcement_reaction', {
      p_announcement_id: announcementId,
      p_user_id: userId,
      p_reaction_type: 'like'
    });
  
  if (error) throw error;
  return data as { likes: number; dislikes: number };
};

export const dislikeAnnouncement = async (announcementId: string, userId: string) => {
  const { data, error } = await supabase
    .rpc('toggle_announcement_reaction', {
      p_announcement_id: announcementId,
      p_user_id: userId,
      p_reaction_type: 'dislike'
    });
  
  if (error) throw error;
  return data as { likes: number; dislikes: number };
};

// Like/dislike functions for replies
export const likeReply = async (replyId: string, userId: string) => {
  const { data, error } = await supabase
    .rpc('toggle_reply_reaction', {
      p_reply_id: replyId,
      p_user_id: userId,
      p_reaction_type: 'like'
    });
  
  if (error) throw error;
  return data as { likes: number; dislikes: number };
};

export const dislikeReply = async (replyId: string, userId: string) => {
  const { data, error } = await supabase
    .rpc('toggle_reply_reaction', {
      p_reply_id: replyId,
      p_user_id: userId,
      p_reaction_type: 'dislike'
    });
  
  if (error) throw error;
  return data as { likes: number; dislikes: number };
};

// Functions for chat messages
export const likeChatMessage = async (messageId: string, userId: string) => {
  const { data, error } = await supabase
    .rpc('toggle_chat_message_reaction', {
      p_message_id: messageId,
      p_user_id: userId,
      p_reaction_type: 'like'
    });
  
  if (error) throw error;
  return data as { likes: number; dislikes: number };
};

export const dislikeChatMessage = async (messageId: string, userId: string) => {
  const { data, error } = await supabase
    .rpc('toggle_chat_message_reaction', {
      p_message_id: messageId,
      p_user_id: userId,
      p_reaction_type: 'dislike'
    });
  
  if (error) throw error;
  return data as { likes: number; dislikes: number };
};

// Functions for getting user interaction status
export const getUserAnnouncementInteraction = async (announcementId: string, userId: string): Promise<{liked: boolean, disliked: boolean}> => {
  try {
    const { data, error } = await supabase
      .from('announcement_reactions')
      .select('reaction_type')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    const liked = data?.some(reaction => reaction.reaction_type === 'like') || false;
    const disliked = data?.some(reaction => reaction.reaction_type === 'dislike') || false;
    
    return { liked, disliked };
  } catch (error) {
    console.error('Error getting user announcement interaction:', error);
    return { liked: false, disliked: false };
  }
};

export const getUserReplyInteraction = async (replyId: string, userId: string): Promise<{liked: boolean, disliked: boolean}> => {
  try {
    const { data, error } = await supabase
      .from('reply_reactions')
      .select('reaction_type')
      .eq('reply_id', replyId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    const liked = data?.some(reaction => reaction.reaction_type === 'like') || false;
    const disliked = data?.some(reaction => reaction.reaction_type === 'dislike') || false;
    
    return { liked, disliked };
  } catch (error) {
    console.error('Error getting user reply interaction:', error);
    return { liked: false, disliked: false };
  }
};

export const getUserChatMessageInteraction = async (messageId: string, userId: string): Promise<{liked: boolean, disliked: boolean}> => {
  try {
    const { data, error } = await supabase
      .from('chat_message_reactions')
      .select('reaction_type')
      .eq('message_id', messageId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    const liked = data?.some(reaction => reaction.reaction_type === 'like') || false;
    const disliked = data?.some(reaction => reaction.reaction_type === 'dislike') || false;
    
    return { liked, disliked };
  } catch (error) {
    console.error('Error getting user chat message interaction:', error);
    return { liked: false, disliked: false };
  }
};
