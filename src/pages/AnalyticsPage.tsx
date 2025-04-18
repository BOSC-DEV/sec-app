
import React from 'react';
import { BarChart, Users, Globe, TrendingUp, Shield, UserCheck, Coins, Receipt, UserRound, MessagesSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { getStatistics } from '@/services/statisticsService';

interface BountyStatsData {
  total_bounties: number;
  active_bounties: number;
  avg_bounty: number;
  total_contributors: number;
}

const fetchAnalyticsData = async (): Promise<{ bountyStats: BountyStatsData }> => {
  try {
    const { data: bountyContributions, error: bountyError } = await supabase
      .from('bounty_contributions')
      .select('amount, scammer_id, contributor_id, is_active')
      .eq('is_active', true);

    if (bountyError) console.error('Error fetching bounty stats:', bountyError);

    const homepageStats = await getStatistics();

    const bountyStats: BountyStatsData = {
      total_bounties: homepageStats.totalBounty,
      active_bounties: 0,
      avg_bounty: 0,
      total_contributors: 0
    };

    if (bountyContributions && bountyContributions.length > 0) {
      const uniqueScammers = new Set(bountyContributions.map(contribution => contribution.scammer_id));
      const uniqueContributors = new Set(bountyContributions.map(contribution => contribution.contributor_id));
      bountyStats.active_bounties = uniqueScammers.size;
      bountyStats.avg_bounty = bountyStats.total_bounties / bountyContributions.length;
      bountyStats.total_contributors = uniqueContributors.size;
    }

    return { bountyStats };
  } catch (error) {
    console.error('Error in fetchAnalyticsData:', error);
    return {
      bountyStats: {
        total_bounties: 0,
        active_bounties: 0,
        avg_bounty: 0,
        total_contributors: 0
      }
    };
  }
};

const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
    staleTime: 1000 * 60 * 5
  });

  const { data: homepageStats } = useQuery({
    queryKey: ['statistics'],
    queryFn: getStatistics,
    staleTime: 1000 * 60 * 5
  });
  
  React.useEffect(() => {
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, () => {
        const queryClient = (window as any).__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__?.getQueryClient();
        if (queryClient) {
          queryClient.invalidateQueries({ queryKey: ['statistics'] });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {homepageStats?.uniqueVisitors || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {homepageStats?.totalMessages || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {homepageStats?.scammersCount || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
            <CurrencyIcon size="md" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.bountyStats?.total_bounties || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bounty</CardTitle>
            <CurrencyIcon size="md" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.bountyStats?.avg_bounty || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (10%)</CardTitle>
            <CurrencyIcon size="md" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency((data?.bountyStats?.total_bounties || 0) * 0.1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{homepageStats?.usersCount || data?.bountyStats?.total_contributors || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
