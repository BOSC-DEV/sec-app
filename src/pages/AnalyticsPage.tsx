import React from 'react';
import { BarChart, Users, Globe, TrendingUp, Shield, DollarSign, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatCurrency';

interface DailyVisitorData {
  day: string;
  unique_visitors: number;
  total_visits: number;
}

interface CountryStatsData {
  country_code: string;
  country_name: string;
  visitor_count: number;
  visit_count: number;
}

interface TopScammerData {
  name: string;
  views: number;
  total_bounty: number;
  report_count: number;
}

interface ReportStatsData {
  day: string;
  report_count: number;
  unique_reporters: number;
}

interface BountyStatsData {
  total_bounties: number;
  active_bounties: number;
  avg_bounty: number;
  total_contributors: number;
}

interface RevenueData {
  totalRevenue: number;
  totalBountiesPaid: number;
}

interface AnalyticsData {
  dailyVisitors: DailyVisitorData[];
  countryStats: CountryStatsData[];
  topScammers: TopScammerData[];
  reportStats: ReportStatsData[];
  bountyStats: BountyStatsData;
}

const fetchAnalyticsData = async (): Promise<AnalyticsData & { revenue: RevenueData }> => {
  try {
    const { data: dailyVisitors, error: dailyError } = await supabase
      .rpc('get_daily_visitors');
    if (dailyError) console.error('Error fetching daily visitors:', dailyError);

    const { data: countryStats, error: countryError } = await supabase
      .rpc('get_country_stats');
    if (countryError) console.error('Error fetching country stats:', countryError);

    const { data: topScammers, error: scammersError } = await supabase
      .from('scammers')
      .select('name, views, bounty_amount, id')
      .order('views', { ascending: false })
      .limit(10);
    if (scammersError) console.error('Error fetching top scammers:', scammersError);
    
    const { data: reportStatsRaw, error: reportError } = await supabase
      .from('report_submissions')
      .select('created_at, user_id')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    if (reportError) console.error('Error fetching report stats:', reportError);
    
    const reportStats: ReportStatsData[] = [];
    if (reportStatsRaw) {
      const reportsByDay = new Map<string, { reports: number, uniqueUsers: Set<string> }>();
      
      reportStatsRaw.forEach(report => {
        const day = new Date(report.created_at).toISOString().split('T')[0];
        if (!reportsByDay.has(day)) {
          reportsByDay.set(day, { reports: 0, uniqueUsers: new Set() });
        }
        
        const dayData = reportsByDay.get(day)!;
        dayData.reports += 1;
        if (report.user_id) {
          dayData.uniqueUsers.add(report.user_id);
        }
      });
      
      reportsByDay.forEach((value, key) => {
        reportStats.push({
          day: key,
          report_count: value.reports,
          unique_reporters: value.uniqueUsers.size
        });
      });
      
      reportStats.sort((a, b) => b.day.localeCompare(a.day));
    }
    
    const { data: bountyContributions, error: bountyError } = await supabase
      .from('bounty_contributions')
      .select('amount, scammer_id, contributor_id, is_active')
      .eq('is_active', true);
    if (bountyError) console.error('Error fetching bounty stats:', bountyError);
    
    const bountyStats: BountyStatsData = {
      total_bounties: 0,
      active_bounties: 0,
      avg_bounty: 0,
      total_contributors: 0
    };
    
    if (bountyContributions && bountyContributions.length > 0) {
      const totalAmount = bountyContributions.reduce((sum, contribution) => sum + Number(contribution.amount), 0);
      const uniqueScammers = new Set(bountyContributions.map(contribution => contribution.scammer_id));
      const uniqueContributors = new Set(bountyContributions.map(contribution => contribution.contributor_id));
      
      bountyStats.total_bounties = totalAmount;
      bountyStats.active_bounties = uniqueScammers.size;
      bountyStats.avg_bounty = totalAmount / bountyContributions.length;
      bountyStats.total_contributors = uniqueContributors.size;
    }
    
    const processedTopScammers: TopScammerData[] = topScammers 
      ? topScammers.map(scammer => ({
          name: scammer.name,
          views: scammer.views || 0,
          total_bounty: scammer.bounty_amount || 0,
          report_count: 0
        }))
      : [];

    const { data: bountiesData, error: bountiesError } = await supabase
      .from('bounty_contributions')
      .select('amount')
      .eq('is_active', true)
      .not('transferred_from_id', 'is', null);

    if (bountiesError) {
      console.error('Error fetching bounties for revenue:', bountiesError);
    }

    const totalBountiesPaid = bountiesData?.reduce((sum, bounty) => sum + Number(bounty.amount), 0) || 0;
    const revenue = {
      totalBountiesPaid,
      totalRevenue: totalBountiesPaid * 0.10
    };

    return {
      dailyVisitors: dailyVisitors || [],
      countryStats: countryStats || [],
      topScammers: processedTopScammers,
      reportStats: reportStats,
      bountyStats: bountyStats,
      revenue
    };
  } catch (error) {
    console.error('Error in fetchAnalyticsData:', error);
    return {
      dailyVisitors: [],
      countryStats: [],
      topScammers: [],
      reportStats: [],
      bountyStats: {
        total_bounties: 0,
        active_bounties: 0,
        avg_bounty: 0,
        total_contributors: 0
      },
      revenue: {
        totalBountiesPaid: 0,
        totalRevenue: 0
      }
    };
  }
};

const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="bounties">Bounties</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.dailyVisitors?.[0]?.unique_visitors || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.reportStats?.reduce((sum, day) => sum + day.report_count, 0) || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data?.bountyStats?.total_bounties.toFixed(2) || '0.00'}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle>Daily Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-right">Unique Visitors</th>
                    <th className="text-right">Total Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.dailyVisitors.map((day, index) => (
                    <tr key={index} className="border-b">
                      <td>{new Date(day.day).toLocaleDateString()}</td>
                      <td className="text-right">{day.unique_visitors}</td>
                      <td className="text-right">{day.total_visits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle>Country Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Country</th>
                    <th className="text-right">Visitors</th>
                    <th className="text-right">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.countryStats.map((country, index) => (
                    <tr key={index} className="border-b">
                      <td>{country.country_name}</td>
                      <td className="text-right">{country.visitor_count}</td>
                      <td className="text-right">{country.visit_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Report Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-right">Reports</th>
                    <th className="text-right">Unique Reporters</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportStats.map((day, index) => (
                    <tr key={index} className="border-b">
                      <td>{new Date(day.day).toLocaleDateString()}</td>
                      <td className="text-right">{day.report_count}</td>
                      <td className="text-right">{day.unique_reporters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bounties">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bounties</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.bountyStats?.active_bounties || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Bounty</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${data?.bountyStats?.avg_bounty.toFixed(2) || '0.00'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Scammers by Bounty</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-right">Views</th>
                      <th className="text-right">Total Bounty</th>
                      <th className="text-right">Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.topScammers.map((scammer, index) => (
                      <tr key={index} className="border-b">
                        <td>{scammer.name}</td>
                        <td className="text-right">{scammer.views}</td>
                        <td className="text-right">${scammer.total_bounty.toFixed(2)}</td>
                        <td className="text-right">{scammer.report_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue (10%)</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${data?.revenue?.totalRevenue.toFixed(2) || '0.00'}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bounties Paid</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${data?.revenue?.totalBountiesPaid.toFixed(2) || '0.00'}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
