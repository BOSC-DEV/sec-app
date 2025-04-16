
import { supabase } from '@/integrations/supabase/client';
import { 
  Announcement, 
  AnnouncementReply,
  ChatMessage,
  SurveyData,
  SurveyOption,
  SurveyVoter,
  EntityType
} from '@/types/dataTypes';
import { Json } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { notifyReaction } from '@/services/notificationService';
import { MAX_SURVEY_OPTIONS, canVoteInSurvey } from '@/utils/adminUtils';

const convertJsonToSurveyData = (data: Json | null): SurveyData | null => {
  if (!data) return null;
  
  try {
    const surveyData = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (typeof surveyData === 'object' && 
        surveyData !== null && 
        'title' in surveyData && 
        'options' in surveyData &&
        Array.isArray(surveyData.options)) {
      
      return {
        title: String(surveyData.title),
        options: surveyData.options.map((option: any) => ({
          text: String(option.text || ''),
          votes: Number(option.votes || 0),
          voters: Array.isArray(option.voters) 
            ? option.voters.map((voter: any) => ({
                userId: String(voter.userId || ''),
                badgeTier: String(voter.badgeTier || ''),
                username: voter.username ? String(voter.username) : undefined,
                displayName: voter.displayName ? String(voter.displayName) : undefined
              }))
            : []
        }))
      };
    }
  } catch (error) {
    console.error('Error parsing survey data:', error);
  }
  
  return null;
};

const convertSurveyDataToJson = (surveyData: SurveyData): Json => {
  return surveyData as unknown as Json;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching announcements:", error);
      return [];
    }
    
    const announcementsWithParsedData = data.map(item => {
      return {
        ...item,
        survey_data: convertJsonToSurveyData(item.survey_data)
      } as Announcement;
    });
    
    return announcementsWithParsedData;
  } catch (error) {
    console.error('Error in getAnnouncements:', error);
    return [];
  }
};

export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'views'>): Promise<Announcement | null> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        content: announcement.content,
        author_id: announcement.author_id,
        author_name: announcement.author_name,
        author_username: announcement.author_username || '',
        author_profile_pic: announcement.author_profile_pic,
        likes: announcement.likes || 0,
        dislikes: announcement.dislikes || 0
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating announcement:", error);
      return null;
    }
    
    return {
      ...data,
      survey_data: convertJsonToSurveyData(data.survey_data)
    } as Announcement;
  } catch (error) {
    console.error('Error in createAnnouncement:', error);
    return null;
  }
};

export const createSurveyAnnouncement = async (
  title: string,
  optionTexts: string[],
  announcement: Omit<Announcement, 'id' | 'created_at' | 'views' | 'content' | 'survey_data'>
): Promise<Announcement | null> => {
  try {
    const options: SurveyOption[] = optionTexts.map(text => ({
      text,
      votes: 0,
      voters: []
    }));
    
    const surveyData: SurveyData = {
      title,
      options
    };
    
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        content: `<p>${title}</p>`,
        author_id: announcement.author_id,
        author_name: announcement.author_name,
        author_username: announcement.author_username || '',
        author_profile_pic: announcement.author_profile_pic,
        likes: announcement.likes || 0,
        dislikes: announcement.dislikes || 0,
        survey_data: convertSurveyDataToJson(surveyData),
        views: 0
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating survey announcement:", error);
      return null;
    }
    
    return {
      ...data,
      survey_data: convertJsonToSurveyData(data.survey_data)
    } as Announcement;
  } catch (error) {
    console.error('Error in createSurveyAnnouncement:', error);
    return null;
  }
};

export const getUserSurveyVote = async (announcementId: string, userId: string): Promise<number | undefined> => {
  try {
    try {
      const storedVotes = JSON.parse(localStorage.getItem('userSurveyVotes') || '{}');
      if (storedVotes[announcementId] !== undefined) {
        console.log("Found vote in localStorage:", announcementId, storedVotes[announcementId]);
        return storedVotes[announcementId];
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
    
    const { data, error } = await supabase
      .from('announcements')
      .select('survey_data')
      .eq('id', announcementId)
      .single();
      
    if (error) {
      console.error("Error fetching survey data:", error);
      return undefined;
    }
    
    const surveyData = convertJsonToSurveyData(data?.survey_data);
    
    if (surveyData) {
      for (let i = 0; i < surveyData.options.length; i++) {
        const option = surveyData.options[i];
        const voterIndex = option.voters.findIndex((voter) => voter.userId === userId);
        if (voterIndex !== -1) {
          try {
            const storedVotes = JSON.parse(localStorage.getItem('userSurveyVotes') || '{}');
            localStorage.setItem('userSurveyVotes', JSON.stringify({
              ...storedVotes,
              [announcementId]: i
            }));
          } catch (error) {
            console.error("Error updating localStorage:", error);
          }
          return i;
        }
      }
    }
    
    return undefined;
  } catch (error) {
    console.error("Error getting user survey vote:", error);
    return undefined;
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
    const { data: announcementData, error: fetchError } = await supabase
      .from('announcements')
      .select('survey_data')
      .eq('id', announcementId)
      .single();
    
    if (fetchError || !announcementData?.survey_data) {
      console.error("Error fetching announcement data:", fetchError);
      return false;
    }
    
    // Safely convert the JSON data to our SurveyData format
    const surveyData = convertJsonToSurveyData(announcementData.survey_data);
    if (!surveyData) {
      console.error("Could not parse survey data");
      return false;
    }
    
    const options = [...surveyData.options];
    
    const alreadyVotedOptionIndex = options.findIndex(option => 
      option.voters.some(voter => voter.userId === userId)
    );
    
    if (alreadyVotedOptionIndex !== -1 && alreadyVotedOptionIndex !== optionIndex) {
      options[alreadyVotedOptionIndex].voters = options[alreadyVotedOptionIndex].voters.filter(
        voter => voter.userId !== userId
      );
      options[alreadyVotedOptionIndex].votes -= 1;
    } else if (alreadyVotedOptionIndex !== optionIndex) {
      options[optionIndex].voters.push({
        userId,
        badgeTier,
        username,
        displayName
      });
      options[optionIndex].votes += 1;
    } else {
      return true;
    }
    
    // Create updated survey data
    const updatedSurveyData: SurveyData = {
      title: surveyData.title,
      options: options
    };
    
    const { error: updateError } = await supabase
      .from('announcements')
      .update({
        survey_data: convertSurveyDataToJson(updatedSurveyData)
      })
      .eq('id', announcementId);
    
    if (updateError) {
      console.error("Error updating survey data:", updateError);
      throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error voting in survey:', error);
    return false;
  }
};

export const editAnnouncement = async (id: string, content: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .update({ content })
      .eq('id', id);
      
    if (error) {
      console.error("Error updating announcement:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in editAnnouncement:', error);
    return false;
  }
};

export const deleteAnnouncement = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting announcement:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAnnouncement:', error);
    return false;
  }
};

export const incrementAnnouncementViews = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('increment_announcement_views', { p_announcement_id: id });
      
    if (error) {
      console.error("Error incrementing announcement views:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in incrementAnnouncementViews:', error);
    return false;
  }
};

export const getAnnouncementReplies = async (announcementId: string): Promise<AnnouncementReply[]> => {
  try {
    const { data, error } = await supabase
      .from('announcement_replies')
      .select('*')
      .eq('announcement_id', announcementId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching announcement replies:", error);
      return [];
    }
    
    return data as AnnouncementReply[];
  } catch (error) {
    console.error('Error in getAnnouncementReplies:', error);
    return [];
  }
};

export const addAnnouncementReply = async (reply: Omit<AnnouncementReply, 'id' | 'created_at'>): Promise<AnnouncementReply | null> => {
  try {
    const { data, error } = await supabase
      .from('announcement_replies')
      .insert({
        announcement_id: reply.announcement_id,
        content: reply.content,
        author_id: reply.author_id,
        author_name: reply.author_name,
        author_username: reply.author_username,
        author_profile_pic: reply.author_profile_pic,
        likes: reply.likes || 0,
        dislikes: reply.dislikes || 0
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error adding announcement reply:", error);
      return null;
    }
    
    return data as AnnouncementReply;
  } catch (error) {
    console.error('Error in addAnnouncementReply:', error);
    return null;
  }
};

export const editAnnouncementReply = async (id: string, content: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcement_replies')
      .update({ content })
      .eq('id', id);
      
    if (error) {
      console.error("Error updating announcement reply:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in editAnnouncementReply:', error);
    return false;
  }
};

export const deleteAnnouncementReply = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcement_replies')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting announcement reply:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAnnouncementReply:', error);
    return false;
  }
};

export const getChatMessages = async (): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
    
    return data as ChatMessage[];
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    return [];
  }
};

export const sendChatMessage = async (message: {
  content: string;
  author_id: string;
  author_name: string;
  author_username?: string;
  author_profile_pic?: string;
  image_file?: File | null;
}): Promise<ChatMessage | null> => {
  try {
    let imageUrl = undefined;
    
    if (message.image_file) {
      const fileName = `chat-images/${message.author_id}/${Date.now()}-${message.image_file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('community')
        .upload(fileName, message.image_file);
        
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('community')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }
    }
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        content: message.content,
        author_id: message.author_id,
        author_name: message.author_name,
        author_username: message.author_username,
        author_profile_pic: message.author_profile_pic,
        image_url: imageUrl,
        likes: 0,
        dislikes: 0
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error sending chat message:", error);
      return null;
    }
    
    return data as ChatMessage;
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    return null;
  }
};

export const deleteChatMessage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting chat message:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteChatMessage:', error);
    return false;
  }
};

export const likeAnnouncement = async (announcementId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('announcement_reactions')
      .select('*')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .single();
      
    let action: 'add' | 'remove' | 'update' = 'add';
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching interaction:", fetchError);
      return null;
    }
    
    if (interaction) {
      if (interaction.reaction_type === 'like') {
        action = 'remove';
      } else {
        action = 'update';
      }
    }
    
    if (action === 'add') {
      const { error: insertError } = await supabase
        .from('announcement_reactions')
        .insert({
          announcement_id: announcementId,
          user_id: userId,
          reaction_type: 'like'
        });
        
      if (insertError) {
        console.error("Error adding like:", insertError);
        return null;
      }
    } else if (action === 'remove') {
      const { error: deleteError } = await supabase
        .from('announcement_reactions')
        .delete()
        .eq('announcement_id', announcementId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error("Error removing like:", deleteError);
        return null;
      }
    } else if (action === 'update') {
      const { error: updateError } = await supabase
        .from('announcement_reactions')
        .update({ reaction_type: 'like' })
        .eq('announcement_id', announcementId)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error("Error updating reaction to like:", updateError);
        return null;
      }
    }
    
    const likesCount = await countAnnouncementReactions(announcementId, 'like');
    const dislikesCount = await countAnnouncementReactions(announcementId, 'dislike');
    
    const { error: updateError } = await supabase
      .from('announcements')
      .update({
        likes: likesCount,
        dislikes: dislikesCount
      })
      .eq('id', announcementId);
      
    if (updateError) {
      console.error("Error updating announcement likes/dislikes:", updateError);
      return null;
    }
    
    if (action !== 'remove') {
      const { data: announcement } = await supabase
        .from('announcements')
        .select('author_id')
        .eq('id', announcementId)
        .single();
        
      if (announcement && announcement.author_id !== userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username, profile_pic_url')
          .eq('wallet_address', userId)
          .single();
          
        if (profile) {
          notifyReaction(
            announcementId,
            EntityType.announcement,
            '',
            'like',
            announcement.author_id,
            userId,
            profile.display_name,
            profile.username,
            profile.profile_pic_url
          );
        }
      }
    }
    
    return { likes: likesCount, dislikes: dislikesCount };
  } catch (error) {
    console.error('Error in likeAnnouncement:', error);
    return null;
  }
};

export const dislikeAnnouncement = async (announcementId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('announcement_reactions')
      .select('*')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .single();
      
    let action: 'add' | 'remove' | 'update' = 'add';
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching interaction:", fetchError);
      return null;
    }
    
    if (interaction) {
      if (interaction.reaction_type === 'dislike') {
        action = 'remove';
      } else {
        action = 'update';
      }
    }
    
    if (action === 'add') {
      const { error: insertError } = await supabase
        .from('announcement_reactions')
        .insert({
          announcement_id: announcementId,
          user_id: userId,
          reaction_type: 'dislike'
        });
        
      if (insertError) {
        console.error("Error adding dislike:", insertError);
        return null;
      }
    } else if (action === 'remove') {
      const { error: deleteError } = await supabase
        .from('announcement_reactions')
        .delete()
        .eq('announcement_id', announcementId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error("Error removing dislike:", deleteError);
        return null;
      }
    } else if (action === 'update') {
      const { error: updateError } = await supabase
        .from('announcement_reactions')
        .update({ reaction_type: 'dislike' })
        .eq('announcement_id', announcementId)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error("Error updating reaction to dislike:", updateError);
        return null;
      }
    }
    
    const likesCount = await countAnnouncementReactions(announcementId, 'like');
    const dislikesCount = await countAnnouncementReactions(announcementId, 'dislike');
    
    const { error: updateError } = await supabase
      .from('announcements')
      .update({
        likes: likesCount,
        dislikes: dislikesCount
      })
      .eq('id', announcementId);
      
    if (updateError) {
      console.error("Error updating announcement likes/dislikes:", updateError);
      return null;
    }
    
    if (action !== 'remove') {
      const { data: announcement } = await supabase
        .from('announcements')
        .select('author_id')
        .eq('id', announcementId)
        .single();
        
      if (announcement && announcement.author_id !== userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username, profile_pic_url')
          .eq('wallet_address', userId)
          .single();
          
        if (profile) {
          notifyReaction(
            announcementId,
            EntityType.announcement,
            '',
            'dislike',
            announcement.author_id,
            userId,
            profile.display_name,
            profile.username,
            profile.profile_pic_url
          );
        }
      }
    }
    
    return { likes: likesCount, dislikes: dislikesCount };
  } catch (error) {
    console.error('Error in dislikeAnnouncement:', error);
    return null;
  }
};

export const likeReply = async (replyId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('reply_reactions')
      .select('*')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
      
    let action: 'add' | 'remove' | 'update' = 'add';
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching interaction:", fetchError);
      return null;
    }
    
    if (interaction) {
      if (interaction.reaction_type === 'like') {
        action = 'remove';
      } else {
        action = 'update';
      }
    }
    
    if (action === 'add') {
      const { error: insertError } = await supabase
        .from('reply_reactions')
        .insert({
          reply_id: replyId,
          user_id: userId,
          reaction_type: 'like'
        });
        
      if (insertError) {
        console.error("Error adding like:", insertError);
        return null;
      }
    } else if (action === 'remove') {
      const { error: deleteError } = await supabase
        .from('reply_reactions')
        .delete()
        .eq('reply_id', replyId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error("Error removing like:", deleteError);
        return null;
      }
    } else if (action === 'update') {
      const { error: updateError } = await supabase
        .from('reply_reactions')
        .update({ reaction_type: 'like' })
        .eq('reply_id', replyId)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error("Error updating reaction to like:", updateError);
        return null;
      }
    }
    
    const likesCount = await countReplyReactions(replyId, 'like');
    const dislikesCount = await countReplyReactions(replyId, 'dislike');
    
    const { error: updateError } = await supabase
      .from('announcement_replies')
      .update({
        likes: likesCount,
        dislikes: dislikesCount
      })
      .eq('id', replyId);
      
    if (updateError) {
      console.error("Error updating reply likes/dislikes:", updateError);
      return null;
    }
    
    if (action !== 'remove') {
      const { data: reply } = await supabase
        .from('announcement_replies')
        .select('author_id')
        .eq('id', replyId)
        .single();
        
      if (reply && reply.author_id !== userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username, profile_pic_url')
          .eq('wallet_address', userId)
          .single();
          
        if (profile) {
          notifyReaction(
            replyId,
            EntityType.reply,
            '',
            'like',
            reply.author_id,
            userId,
            profile.display_name,
            profile.username,
            profile.profile_pic_url
          );
        }
      }
    }
    
    return { likes: likesCount, dislikes: dislikesCount };
  } catch (error) {
    console.error('Error in likeReply:', error);
    return null;
  }
};

export const dislikeReply = async (replyId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('reply_reactions')
      .select('*')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
      
    let action: 'add' | 'remove' | 'update' = 'add';
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching interaction:", fetchError);
      return null;
    }
    
    if (interaction) {
      if (interaction.reaction_type === 'dislike') {
        action = 'remove';
      } else {
        action = 'update';
      }
    }
    
    if (action === 'add') {
      const { error: insertError } = await supabase
        .from('reply_reactions')
        .insert({
          reply_id: replyId,
          user_id: userId,
          reaction_type: 'dislike'
        });
        
      if (insertError) {
        console.error("Error adding dislike:", insertError);
        return null;
      }
    } else if (action === 'remove') {
      const { error: deleteError } = await supabase
        .from('reply_reactions')
        .delete()
        .eq('reply_id', replyId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error("Error removing dislike:", deleteError);
        return null;
      }
    } else if (action === 'update') {
      const { error: updateError } = await supabase
        .from('reply_reactions')
        .update({ reaction_type: 'dislike' })
        .eq('reply_id', replyId)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error("Error updating reaction to dislike:", updateError);
        return null;
      }
    }
    
    const likesCount = await countReplyReactions(replyId, 'like');
    const dislikesCount = await countReplyReactions(replyId, 'dislike');
    
    const { error: updateError } = await supabase
      .from('announcement_replies')
      .update({
        likes: likesCount,
        dislikes: dislikesCount
      })
      .eq('id', replyId);
      
    if (updateError) {
      console.error("Error updating reply likes/dislikes:", updateError);
      return null;
    }
    
    if (action !== 'remove') {
      const { data: reply } = await supabase
        .from('announcement_replies')
        .select('author_id')
        .eq('id', replyId)
        .single();
        
      if (reply && reply.author_id !== userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username, profile_pic_url')
          .eq('wallet_address', userId)
          .single();
          
        if (profile) {
          notifyReaction(
            replyId,
            EntityType.reply,
            '',
            'dislike',
            reply.author_id,
            userId,
            profile.display_name,
            profile.username,
            profile.profile_pic_url
          );
        }
      }
    }
    
    return { likes: likesCount, dislikes: dislikesCount };
  } catch (error) {
    console.error('Error in dislikeReply:', error);
    return null;
  }
};

export const likeChatMessage = async (messageId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('chat_message_reactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .single();
      
    let action: 'add' | 'remove' | 'update' = 'add';
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching interaction:", fetchError);
      return null;
    }
    
    if (interaction) {
      if (interaction.reaction_type === 'like') {
        action = 'remove';
      } else {
        action = 'update';
      }
    }
    
    if (action === 'add') {
      const { error: insertError } = await supabase
        .from('chat_message_reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          reaction_type: 'like'
        });
        
      if (insertError) {
        console.error("Error adding like:", insertError);
        return null;
      }
    } else if (action === 'remove') {
      const { error: deleteError } = await supabase
        .from('chat_message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error("Error removing like:", deleteError);
        return null;
      }
    } else if (action === 'update') {
      const { error: updateError } = await supabase
        .from('chat_message_reactions')
        .update({ reaction_type: 'like' })
        .eq('message_id', messageId)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error("Error updating reaction to like:", updateError);
        return null;
      }
    }
    
    const likesCount = await countChatMessageReactions(messageId, 'like');
    const dislikesCount = await countChatMessageReactions(messageId, 'dislike');
    
    const { error: updateError } = await supabase
      .from('chat_messages')
      .update({
        likes: likesCount,
        dislikes: dislikesCount
      })
      .eq('id', messageId);
      
    if (updateError) {
      console.error("Error updating message likes/dislikes:", updateError);
      return null;
    }
    
    if (action !== 'remove') {
      const { data: message } = await supabase
        .from('chat_messages')
        .select('author_id')
        .eq('id', messageId)
        .single();
        
      if (message && message.author_id !== userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username, profile_pic_url')
          .eq('wallet_address', userId)
          .single();
          
        if (profile) {
          notifyReaction(
            messageId,
            EntityType.chat_message,
            '',
            'like',
            message.author_id,
            userId,
            profile.display_name,
            profile.username,
            profile.profile_pic_url
          );
        }
      }
    }
    
    return { likes: likesCount, dislikes: dislikesCount };
  } catch (error) {
    console.error('Error in likeChatMessage:', error);
    return null;
  }
};

export const dislikeChatMessage = async (messageId: string, userId: string): Promise<{ likes: number, dislikes: number } | null> => {
  try {
    const { data: interaction, error: fetchError } = await supabase
      .from('chat_message_reactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .single();
      
    let action: 'add' | 'remove' | 'update' = 'add';
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching interaction:", fetchError);
      return null;
    }
    
    if (interaction) {
      if (interaction.reaction_type === 'dislike') {
        action = 'remove';
      } else {
        action = 'update';
      }
    }
    
    if (action === 'add') {
      const { error: insertError } = await supabase
        .from('chat_message_reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          reaction_type: 'dislike'
        });
        
      if (insertError) {
        console.error("Error adding dislike:", insertError);
        return null;
      }
    } else if (action === 'remove') {
      const { error: deleteError } = await supabase
        .from('chat_message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error("Error removing dislike:", deleteError);
        return null;
      }
    } else if (action === 'update') {
      const { error: updateError } = await supabase
        .from('chat_message_reactions')
        .update({ reaction_type: 'dislike' })
        .eq('message_id', messageId)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error("Error updating reaction to dislike:", updateError);
        return null;
      }
    }
    
    const likesCount = await countChatMessageReactions(messageId, 'like');
    const dislikesCount = await countChatMessageReactions(messageId, 'dislike');
    
    const { error: updateError } = await supabase
      .from('chat_messages')
      .update({
        likes: likesCount,
        dislikes: dislikesCount
      })
      .eq('id', messageId);
      
    if (updateError) {
      console.error("Error updating message likes/dislikes:", updateError);
      return null;
    }
    
    if (action !== 'remove') {
      const { data: message } = await supabase
        .from('chat_messages')
        .select('author_id')
        .eq('id', messageId)
        .single();
        
      if (message && message.author_id !== userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username, profile_pic_url')
          .eq('wallet_address', userId)
          .single();
          
        if (profile) {
          notifyReaction(
            messageId,
            EntityType.chat_message,
            '',
            'dislike',
            message.author_id,
            userId,
            profile.display_name,
            profile.username,
            profile.profile_pic_url
          );
        }
      }
    }
    
    return { likes: likesCount, dislikes: dislikesCount };
  } catch (error) {
    console.error('Error in dislikeChatMessage:', error);
    return null;
  }
};

const countAnnouncementReactions = async (announcementId: string, reactionType: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('announcement_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('announcement_id', announcementId)
      .eq('reaction_type', reactionType);
      
    if (error) {
      console.error(`Error counting ${reactionType}s:`, error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error(`Error in countAnnouncementReactions for ${reactionType}:`, error);
    return 0;
  }
};

const countReplyReactions = async (replyId: string, reactionType: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('reply_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('reply_id', replyId)
      .eq('reaction_type', reactionType);
      
    if (error) {
      console.error(`Error counting ${reactionType}s:`, error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error(`Error in countReplyReactions for ${reactionType}:`, error);
    return 0;
  }
};

const countChatMessageReactions = async (messageId: string, reactionType: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('chat_message_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('message_id', messageId)
      .eq('reaction_type', reactionType);
      
    if (error) {
      console.error(`Error counting ${reactionType}s:`, error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error(`Error in countChatMessageReactions for ${reactionType}:`, error);
    return 0;
  }
};

export const getUserAnnouncementInteraction = async (announcementId: string, userId: string): Promise<{ liked: boolean, disliked: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('announcement_reactions')
      .select('reaction_type')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user announcement interaction:", error);
      return { liked: false, disliked: false };
    }
    
    return {
      liked: data?.reaction_type === 'like',
      disliked: data?.reaction_type === 'dislike'
    };
  } catch (error) {
    console.error('Error in getUserAnnouncementInteraction:', error);
    return { liked: false, disliked: false };
  }
};

export const getUserReplyInteraction = async (replyId: string, userId: string): Promise<{ liked: boolean, disliked: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('reply_reactions')
      .select('reaction_type')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user reply interaction:", error);
      return { liked: false, disliked: false };
    }
    
    return {
      liked: data?.reaction_type === 'like',
      disliked: data?.reaction_type === 'dislike'
    };
  } catch (error) {
    console.error('Error in getUserReplyInteraction:', error);
    return { liked: false, disliked: false };
  }
};

export const getUserChatMessageInteraction = async (messageId: string, userId: string): Promise<{ liked: boolean, disliked: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('chat_message_reactions')
      .select('reaction_type')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user chat message interaction:", error);
      return { liked: false, disliked: false };
    }
    
    return {
      liked: data?.reaction_type === 'like',
      disliked: data?.reaction_type === 'dislike'
    };
  } catch (error) {
    console.error('Error in getUserChatMessageInteraction:', error);
    return { liked: false, disliked: false };
  }
};

export const isUserAdmin = async (username: string): Promise<boolean> => {
  const { ADMIN_USERNAMES } = await import('@/utils/adminUtils');
  return ADMIN_USERNAMES.includes(username);
};
