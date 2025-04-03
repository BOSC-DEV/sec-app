
import { supabase } from '@/integrations/supabase/client';

export const getStatistics = async () => {
  try {
    // Get total bounty amount
    const { data: bountyData, error: bountyError } = await supabase
      .from('scammers')
      .select('bounty_amount')
      .is('deleted_at', null);
    
    if (bountyError) throw bountyError;
    
    const totalBounty = bountyData.reduce((sum, scammer) => sum + (scammer.bounty_amount || 0), 0);
    
    // Get total scammers count
    const { count: scammersCount, error: scammersError } = await supabase
      .from('scammers')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);
    
    if (scammersError) throw scammersError;
    
    // Get unique reporters count
    const { data: reportersData, error: reportersError } = await supabase
      .from('scammers')
      .select('added_by')
      .is('deleted_at', null);
    
    if (reportersError) throw reportersError;
    
    // Filter out null values and count unique reporters
    const uniqueReporters = new Set(reportersData.filter(item => item.added_by).map(item => item.added_by));
    const reportersCount = uniqueReporters.size;
    
    // Get total users count
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) throw usersError;
    
    return {
      totalBounty,
      scammersCount: scammersCount || 0,
      reportersCount,
      usersCount: usersCount || 0
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Return default values in case of error
    return {
      totalBounty: 0,
      scammersCount: 0,
      reportersCount: 0,
      usersCount: 0
    };
  }
};
