
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
