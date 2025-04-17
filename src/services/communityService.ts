
import { supabase } from '@/integrations/supabase/client';
import { Announcement, AnnouncementReply, SurveyData, SurveyOption, SurveyVoter } from '@/types/dataTypes';

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // If no announcements exist, create a mock announcement
    if (!data || data.length === 0) {
      const mockAnnouncement = await createInitialMockAnnouncement();
      if (mockAnnouncement) {
        return [mockAnnouncement];
      }
    }
    
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

// Create an initial mock announcement for new installations
export const createInitialMockAnnouncement = async (): Promise<Announcement | null> => {
  try {
    const mockContent = `
      <h3>Welcome to the SEC Community!</h3>
      <p>This is a place where we gather to discuss and share information about scams and fraud prevention.</p>
      <p>Here are some community guidelines:</p>
      <ul>
        <li>Be respectful to other community members</li>
        <li>Share verified information about scams you encounter</li>
        <li>Help each other stay safe from fraud and scams</li>
        <li>Report suspicious activities through proper channels</li>
      </ul>
      <p>Let's work together to make the crypto space safer for everyone!</p>
    `;

    const announcement: Announcement = {
      id: 'mock-announcement-001',
      content: mockContent,
      author_id: 'system',
      author_name: 'SEC System',
      author_username: 'system',
      author_profile_pic: '/placeholder.svg',
      created_at: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      views: 0
    };

    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select('*')
      .single();

    if (error) throw error;
    return data as Announcement;
  } catch (error) {
    console.error('Error creating mock announcement:', error);
    return null;
  }
};

// Function to create a new announcement
export const createAnnouncement = async (announcement: Partial<Announcement>): Promise<Announcement | null> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select('*')
      .single();
      
    if (error) throw error;
    return data as Announcement;
  } catch (error) {
    console.error('Error creating announcement:', error);
    return null;
  }
};

// Function to increment views for an announcement
export const incrementAnnouncementViews = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_announcement_views', { announcement_id: id });
    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing announcement views:', error);
  }
};

// Function to delete an announcement
export const deleteAnnouncement = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return false;
  }
};

// Function to edit an announcement
export const editAnnouncement = async (id: string, content: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .update({ content })
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error editing announcement:', error);
    return false;
  }
};

// Check if a user is an admin
export const isUserAdmin = async (username: string): Promise<boolean> => {
  try {
    // This is a simplified version - in a real app, you'd check against a database
    // of admin users or roles.
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error) throw error;
    
    // In this simple implementation, we're assuming admins have a 
    // specific badge tier or attribute. You would need to modify this
    // based on your actual admin detection logic.
    return data?.is_admin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Function to create a survey announcement
export const createSurveyAnnouncement = async (
  title: string, 
  options: string[],
  announcementData: Partial<Announcement>
): Promise<Announcement | null> => {
  try {
    const surveyOptions: SurveyOption[] = options.map(text => ({
      text,
      votes: 0,
      voters: []
    }));
    
    const surveyData: SurveyData = {
      title,
      options: surveyOptions
    };
    
    const announcement = {
      ...announcementData,
      content: `<p>Survey: ${title}</p>`,
      survey_data: surveyData
    };
    
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select('*')
      .single();
      
    if (error) throw error;
    return data as Announcement;
  } catch (error) {
    console.error('Error creating survey:', error);
    return null;
  }
};

// Function for users to vote in a survey
export const voteSurvey = async (
  announcementId: string,
  optionIndex: number,
  userId: string,
  badgeTier: string,
  displayName?: string,
  username?: string
): Promise<boolean> => {
  try {
    // First, get the current announcement with survey data
    const { data: currentAnnouncement, error: fetchError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .single();
    
    if (fetchError) throw fetchError;
    
    if (!currentAnnouncement?.survey_data) {
      throw new Error('No survey data found');
    }
    
    // Parse the survey data
    const surveyData = currentAnnouncement.survey_data as unknown as SurveyData;
    
    if (!surveyData.options[optionIndex]) {
      throw new Error('Invalid option index');
    }
    
    // Remove voter from any previous votes
    const updatedOptions = surveyData.options.map(option => {
      return {
        ...option,
        voters: option.voters.filter(voter => voter.userId !== userId)
      };
    });
    
    // Add vote to the selected option
    updatedOptions[optionIndex].votes += 1;
    updatedOptions[optionIndex].voters.push({
      userId,
      badgeTier,
      displayName,
      username
    });
    
    const updatedSurveyData = {
      ...surveyData,
      options: updatedOptions
    };
    
    // Update the announcement with the new survey data
    const { error: updateError } = await supabase
      .from('announcements')
      .update({ survey_data: updatedSurveyData })
      .eq('id', announcementId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error voting in survey:', error);
    return false;
  }
};

// Get user's vote in a survey
export const getUserSurveyVote = async (announcementId: string, userId: string): Promise<number | undefined> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('survey_data')
      .eq('id', announcementId)
      .single();
    
    if (error) throw error;
    
    if (!data?.survey_data) return undefined;
    
    const surveyData = data.survey_data as unknown as SurveyData;
    
    for (let i = 0; i < surveyData.options.length; i++) {
      if (surveyData.options[i].voters.some(voter => voter.userId === userId)) {
        return i;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting user survey vote:', error);
    return undefined;
  }
};

// Announcement replies functions
export const getAnnouncementReplies = async (announcementId: string): Promise<AnnouncementReply[]> => {
  try {
    const { data, error } = await supabase
      .from('announcement_replies')
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

export const addAnnouncementReply = async (reply: Partial<AnnouncementReply>): Promise<AnnouncementReply | null> => {
  try {
    const { data, error } = await supabase
      .from('announcement_replies')
      .insert(reply)
      .select('*')
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
    const { error } = await supabase
      .from('announcement_replies')
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
    const { error } = await supabase
      .from('announcement_replies')
      .update({ content })
      .eq('id', replyId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error editing announcement reply:', error);
    return false;
  }
};

// Reaction functions
export const likeAnnouncement = async (announcementId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('user_announcement_interactions')
      .select('*')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
    
    let liked = false;
    
    if (fetchError) throw fetchError;
    
    if (interaction) {
      // If already liked, unlike
      if (interaction.liked) {
        const { error } = await supabase
          .from('user_announcement_interactions')
          .update({ liked: false, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
      } else {
        // Like and remove dislike if present
        const { error } = await supabase
          .from('user_announcement_interactions')
          .update({ liked: true, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
        liked = true;
      }
    } else {
      // Create new interaction
      const { error } = await supabase
        .from('user_announcement_interactions')
        .insert({
          announcement_id: announcementId,
          user_id: userId,
          liked: true,
          disliked: false
        });
      
      if (error) throw error;
      liked = true;
    }
    
    // Update announcement like/dislike count
    await updateAnnouncementLikeCount(announcementId);
    
    // Get updated counts
    const { data: updatedAnnouncement, error: countError } = await supabase
      .from('announcements')
      .select('likes, dislikes')
      .eq('id', announcementId)
      .single();
    
    if (countError) throw countError;
    
    return {
      likes: updatedAnnouncement.likes,
      dislikes: updatedAnnouncement.dislikes
    };
  } catch (error) {
    console.error('Error liking announcement:', error);
    return null;
  }
};

export const dislikeAnnouncement = async (announcementId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('user_announcement_interactions')
      .select('*')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
    
    let disliked = false;
    
    if (fetchError) throw fetchError;
    
    if (interaction) {
      // If already disliked, remove dislike
      if (interaction.disliked) {
        const { error } = await supabase
          .from('user_announcement_interactions')
          .update({ liked: false, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
      } else {
        // Dislike and remove like if present
        const { error } = await supabase
          .from('user_announcement_interactions')
          .update({ liked: false, disliked: true })
          .eq('id', interaction.id);
        
        if (error) throw error;
        disliked = true;
      }
    } else {
      // Create new interaction
      const { error } = await supabase
        .from('user_announcement_interactions')
        .insert({
          announcement_id: announcementId,
          user_id: userId,
          liked: false,
          disliked: true
        });
      
      if (error) throw error;
      disliked = true;
    }
    
    // Update announcement like/dislike count
    await updateAnnouncementLikeCount(announcementId);
    
    // Get updated counts
    const { data: updatedAnnouncement, error: countError } = await supabase
      .from('announcements')
      .select('likes, dislikes')
      .eq('id', announcementId)
      .single();
    
    if (countError) throw countError;
    
    return {
      likes: updatedAnnouncement.likes,
      dislikes: updatedAnnouncement.dislikes
    };
  } catch (error) {
    console.error('Error disliking announcement:', error);
    return null;
  }
};

// Helper function to update like/dislike counts for an announcement
const updateAnnouncementLikeCount = async (announcementId: string): Promise<void> => {
  try {
    // Count likes
    const { count: likeCount, error: likeError } = await supabase
      .from('user_announcement_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('announcement_id', announcementId)
      .eq('liked', true);
    
    if (likeError) throw likeError;
    
    // Count dislikes
    const { count: dislikeCount, error: dislikeError } = await supabase
      .from('user_announcement_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('announcement_id', announcementId)
      .eq('disliked', true);
    
    if (dislikeError) throw dislikeError;
    
    // Update announcement with new counts
    const { error: updateError } = await supabase
      .from('announcements')
      .update({
        likes: likeCount || 0,
        dislikes: dislikeCount || 0
      })
      .eq('id', announcementId);
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating announcement like count:', error);
  }
};

// Functions for user interactions
export const getUserAnnouncementInteraction = async (announcementId: string, userId: string): Promise<{ liked: boolean, disliked: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('user_announcement_interactions')
      .select('liked, disliked')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    return {
      liked: data?.liked || false,
      disliked: data?.disliked || false
    };
  } catch (error) {
    console.error('Error getting user announcement interaction:', error);
    return { liked: false, disliked: false };
  }
};

// Reply likes and dislikes
export const likeReply = async (replyId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('user_reply_interactions')
      .select('*')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .maybeSingle();
    
    let liked = false;
    
    if (fetchError) throw fetchError;
    
    if (interaction) {
      // If already liked, unlike
      if (interaction.liked) {
        const { error } = await supabase
          .from('user_reply_interactions')
          .update({ liked: false, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
      } else {
        // Like and remove dislike if present
        const { error } = await supabase
          .from('user_reply_interactions')
          .update({ liked: true, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
        liked = true;
      }
    } else {
      // Create new interaction
      const { error } = await supabase
        .from('user_reply_interactions')
        .insert({
          reply_id: replyId,
          user_id: userId,
          liked: true,
          disliked: false
        });
      
      if (error) throw error;
      liked = true;
    }
    
    // Update reply like/dislike count
    await updateReplyLikeCount(replyId);
    
    // Get updated counts
    const { data: updatedReply, error: countError } = await supabase
      .from('announcement_replies')
      .select('likes, dislikes')
      .eq('id', replyId)
      .single();
    
    if (countError) throw countError;
    
    return {
      likes: updatedReply.likes,
      dislikes: updatedReply.dislikes
    };
  } catch (error) {
    console.error('Error liking reply:', error);
    return null;
  }
};

export const dislikeReply = async (replyId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('user_reply_interactions')
      .select('*')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .maybeSingle();
    
    let disliked = false;
    
    if (fetchError) throw fetchError;
    
    if (interaction) {
      // If already disliked, remove dislike
      if (interaction.disliked) {
        const { error } = await supabase
          .from('user_reply_interactions')
          .update({ liked: false, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
      } else {
        // Dislike and remove like if present
        const { error } = await supabase
          .from('user_reply_interactions')
          .update({ liked: false, disliked: true })
          .eq('id', interaction.id);
        
        if (error) throw error;
        disliked = true;
      }
    } else {
      // Create new interaction
      const { error } = await supabase
        .from('user_reply_interactions')
        .insert({
          reply_id: replyId,
          user_id: userId,
          liked: false,
          disliked: true
        });
      
      if (error) throw error;
      disliked = true;
    }
    
    // Update reply like/dislike count
    await updateReplyLikeCount(replyId);
    
    // Get updated counts
    const { data: updatedReply, error: countError } = await supabase
      .from('announcement_replies')
      .select('likes, dislikes')
      .eq('id', replyId)
      .single();
    
    if (countError) throw countError;
    
    return {
      likes: updatedReply.likes,
      dislikes: updatedReply.dislikes
    };
  } catch (error) {
    console.error('Error disliking reply:', error);
    return null;
  }
};

// Helper function to update like/dislike counts for a reply
const updateReplyLikeCount = async (replyId: string): Promise<void> => {
  try {
    // Count likes
    const { count: likeCount, error: likeError } = await supabase
      .from('user_reply_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('reply_id', replyId)
      .eq('liked', true);
    
    if (likeError) throw likeError;
    
    // Count dislikes
    const { count: dislikeCount, error: dislikeError } = await supabase
      .from('user_reply_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('reply_id', replyId)
      .eq('disliked', true);
    
    if (dislikeError) throw dislikeError;
    
    // Update reply with new counts
    const { error: updateError } = await supabase
      .from('announcement_replies')
      .update({
        likes: likeCount || 0,
        dislikes: dislikeCount || 0
      })
      .eq('id', replyId);
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating reply like count:', error);
  }
};

export const getUserReplyInteraction = async (replyId: string, userId: string): Promise<{ liked: boolean, disliked: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('user_reply_interactions')
      .select('liked, disliked')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    return {
      liked: data?.liked || false,
      disliked: data?.disliked || false
    };
  } catch (error) {
    console.error('Error getting user reply interaction:', error);
    return { liked: false, disliked: false };
  }
};

// Chat message likes and dislikes
export const likeChatMessage = async (messageId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('user_chat_message_interactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
    
    let liked = false;
    
    if (fetchError) throw fetchError;
    
    if (interaction) {
      // If already liked, unlike
      if (interaction.liked) {
        const { error } = await supabase
          .from('user_chat_message_interactions')
          .update({ liked: false, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
      } else {
        // Like and remove dislike if present
        const { error } = await supabase
          .from('user_chat_message_interactions')
          .update({ liked: true, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
        liked = true;
      }
    } else {
      // Create new interaction
      const { error } = await supabase
        .from('user_chat_message_interactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          liked: true,
          disliked: false
        });
      
      if (error) throw error;
      liked = true;
    }
    
    // Update message like/dislike count
    await updateChatMessageLikeCount(messageId);
    
    // Get updated counts
    const { data: updatedMessage, error: countError } = await supabase
      .from('chat_messages')
      .select('likes, dislikes')
      .eq('id', messageId)
      .single();
    
    if (countError) throw countError;
    
    return {
      likes: updatedMessage.likes,
      dislikes: updatedMessage.dislikes
    };
  } catch (error) {
    console.error('Error liking chat message:', error);
    return null;
  }
};

export const dislikeChatMessage = async (messageId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('user_chat_message_interactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
    
    let disliked = false;
    
    if (fetchError) throw fetchError;
    
    if (interaction) {
      // If already disliked, remove dislike
      if (interaction.disliked) {
        const { error } = await supabase
          .from('user_chat_message_interactions')
          .update({ liked: false, disliked: false })
          .eq('id', interaction.id);
        
        if (error) throw error;
      } else {
        // Dislike and remove like if present
        const { error } = await supabase
          .from('user_chat_message_interactions')
          .update({ liked: false, disliked: true })
          .eq('id', interaction.id);
        
        if (error) throw error;
        disliked = true;
      }
    } else {
      // Create new interaction
      const { error } = await supabase
        .from('user_chat_message_interactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          liked: false,
          disliked: true
        });
      
      if (error) throw error;
      disliked = true;
    }
    
    // Update message like/dislike count
    await updateChatMessageLikeCount(messageId);
    
    // Get updated counts
    const { data: updatedMessage, error: countError } = await supabase
      .from('chat_messages')
      .select('likes, dislikes')
      .eq('id', messageId)
      .single();
    
    if (countError) throw countError;
    
    return {
      likes: updatedMessage.likes,
      dislikes: updatedMessage.dislikes
    };
  } catch (error) {
    console.error('Error disliking chat message:', error);
    return null;
  }
};

// Helper function to update like/dislike counts for a chat message
const updateChatMessageLikeCount = async (messageId: string): Promise<void> => {
  try {
    // Count likes
    const { count: likeCount, error: likeError } = await supabase
      .from('user_chat_message_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('message_id', messageId)
      .eq('liked', true);
    
    if (likeError) throw likeError;
    
    // Count dislikes
    const { count: dislikeCount, error: dislikeError } = await supabase
      .from('user_chat_message_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('message_id', messageId)
      .eq('disliked', true);
    
    if (dislikeError) throw dislikeError;
    
    // Update message with new counts
    const { error: updateError } = await supabase
      .from('chat_messages')
      .update({
        likes: likeCount || 0,
        dislikes: dislikeCount || 0
      })
      .eq('id', messageId);
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating chat message like count:', error);
  }
};

export const getUserChatMessageInteraction = async (messageId: string, userId: string): Promise<{ liked: boolean, disliked: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('user_chat_message_interactions')
      .select('liked, disliked')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    return {
      liked: data?.liked || false,
      disliked: data?.disliked || false
    };
  } catch (error) {
    console.error('Error getting user chat message interaction:', error);
    return { liked: false, disliked: false };
  }
};
