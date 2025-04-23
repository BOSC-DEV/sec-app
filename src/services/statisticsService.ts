
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';
import { ErrorSeverity } from '@/utils/errorSeverity';

interface Statistics {
  totalBounty: number;
  scammersCount: number;
  reportersCount: number;
  usersCount: number;
}

export const getStatistics = async (): Promise<Statistics> => {
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
    handleError(error, {
      fallbackMessage: 'Error fetching statistics',
      severity: ErrorSeverity.MEDIUM,
      context: 'getStatistics'
    });
    // Return default values in case of error
    return {
      totalBounty: 0,
      scammersCount: 0,
      reportersCount: 0,
      usersCount: 0
    };
  }
};

// Add a function to get profile statistics for the leaderboard
export const getProfileStatistics = async (): Promise<any[]> => {
  try {
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    
    if (!profiles || profiles.length === 0) return [];
    
    // Get reports count for each profile (where they are listed as added_by)
    const { data: scammers, error: scammersError } = await supabase
      .from('scammers')
      .select('added_by, likes, views, bounty_amount')
      .is('deleted_at', null);
    
    if (scammersError) throw scammersError;
    
    // Get comments count for each profile
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('author, likes, views');
    
    if (commentsError) throw commentsError;
    
    // Get bounty contributions for each profile
    const { data: bountyContributions, error: bountyError } = await supabase
      .from('bounty_contributions')
      .select('contributor_id, amount');
    
    if (bountyError) throw bountyError;
    
    // Calculate statistics for each profile
    return profiles.map(profile => {
      // Count reports by this profile
      const reportsCount = scammers.filter(scammer => 
        scammer.added_by === profile.wallet_address
      ).length;
      
      // Sum likes on scammers reported by this profile
      const scammerLikes = scammers
        .filter(scammer => scammer.added_by === profile.wallet_address)
        .reduce((sum, scammer) => sum + (scammer.likes || 0), 0);
      
      // Sum views on scammers reported by this profile
      const scammerViews = scammers
        .filter(scammer => scammer.added_by === profile.wallet_address)
        .reduce((sum, scammer) => sum + (scammer.views || 0), 0);
      
      // Count comments by this profile
      const commentsCount = comments.filter(comment => 
        comment.author === profile.wallet_address
      ).length;
      
      // Sum likes on comments by this profile
      const commentLikes = comments
        .filter(comment => comment.author === profile.wallet_address)
        .reduce((sum, comment) => sum + (comment.likes || 0), 0);
      
      // Sum views on comments by this profile
      const commentViews = comments
        .filter(comment => comment.author === profile.wallet_address)
        .reduce((sum, comment) => sum + (comment.views || 0), 0);
      
      // Sum total bounty contributed by this profile
      const bountyAmount = bountyContributions
        .filter(contribution => contribution.contributor_id === profile.wallet_address)
        .reduce((sum, contribution) => sum + (contribution.amount || 0), 0);
      
      // Calculate bounties raised (total bounties on scammers reported by this profile)
      const bountiesRaised = scammers
        .filter(scammer => scammer.added_by === profile.wallet_address)
        .reduce((sum, scammer) => sum + (scammer.bounty_amount || 0), 0);
      
      // Add up all statistics
      return {
        ...profile,
        reports_count: reportsCount,
        likes_count: scammerLikes + commentLikes,
        views_count: scammerViews + commentViews,
        comments_count: commentsCount,
        bounty_amount: bountyAmount,
        bounties_raised: bountiesRaised
      };
    });
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to fetch profile statistics',
      severity: ErrorSeverity.MEDIUM,
      context: 'getProfileStatistics'
    });
    return [];
  }
};
