import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/dataTypes';
import { isAdmin } from '@/utils/adminUtils';

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Announcement[];
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
  
  // Otherwise check the database if needed (for dynamic admin management)
  try {
    // You could implement database check here if needed
    // For now, just return false as all admins are in the hardcoded list
    return false;
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
}): Promise<Announcement | null> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...announcement
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as Announcement;
  } catch (error) {
    console.error('Error creating announcement:', error);
    return null;
  }
};

export const incrementAnnouncementViews = async (announcementId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_announcement_views', {
      p_announcement_id: announcementId
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
  }
): Promise<Announcement | null> => {
  try {
    // Create options structure with initial empty votes
    const surveyOptions = options.map(option => ({
      text: option,
      votes: 0,
      voters: []
    }));
    
    const surveyData = {
      title,
      options: surveyOptions
    };
    
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...announcement,
        content: `<p>${title}</p>`,
        survey_data: surveyData
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as Announcement;
  } catch (error) {
    console.error('Error creating survey announcement:', error);
    return null;
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
    
    const surveyData = announcement.survey_data;
    const options = surveyData.options;
    
    if (optionIndex < 0 || optionIndex >= options.length) {
      throw new Error('Invalid option index');
    }
    
    // Check if user has already voted for a different option
    let userPreviousVote = -1;
    for (let i = 0; i < options.length; i++) {
      const voterIndex = options[i].voters.findIndex(voter => voter.userId === userId);
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
        .update({ survey_data: surveyData })
        .eq('id', announcementId);
        
      if (updateError) throw updateError;
      return true;
    }
    
    // Add the user's vote to the selected option
    options[optionIndex].votes += 1;
    options[optionIndex].voters.push({
      userId,
      badgeTier,
      displayName,
      username,
      timestamp: new Date().toISOString()
    });
    
    // Update the announcement
    const { error: updateError } = await supabase
      .from('announcements')
      .update({ survey_data: surveyData })
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
    
    const options = data.survey_data.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].voters.some(voter => voter.userId === userId)) {
        return i;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting user survey vote:', error);
    return undefined;
  }
};
