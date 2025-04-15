
// Add getUserSurveyVote function
export const getUserSurveyVote = async (announcementId: string, userId: string): Promise<number | undefined> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .single();
      
    if (error) {
      console.error("Error fetching survey data:", error);
      return undefined;
    }
    
    // Parse survey_data if it's a string
    let surveyData = data.survey_data;
    if (!surveyData) return undefined;
    
    if (typeof surveyData === 'string') {
      try {
        surveyData = JSON.parse(surveyData);
      } catch (e) {
        console.error("Error parsing survey data:", e);
        return undefined;
      }
    }
    
    // Find the option index where the user voted
    for (let i = 0; i < surveyData.options.length; i++) {
      const option = surveyData.options[i];
      const voterIndex = option.voters.findIndex((voter: any) => voter.userId === userId);
      if (voterIndex !== -1) {
        return i;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error("Error getting user survey vote:", error);
    return undefined;
  }
};
