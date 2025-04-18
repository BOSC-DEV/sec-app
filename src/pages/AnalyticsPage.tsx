import React from 'react';
import { BarChart, Users, Globe, TrendingUp, Shield, UserCheck, Coins, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { getStatistics } from '@/services/statisticsService';
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
interface AnalyticsData {
  dailyVisitors: DailyVisitorData[];
  countryStats: CountryStatsData[];
  topScammers: TopScammerData[];
  reportStats: ReportStatsData[];
  bountyStats: BountyStatsData;
}
interface HomepageStatistics {
  totalBounty: number;
  scammersCount: number;
  reportersCount: number;
  usersCount: number;
}
const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    // Get the homepage statistics to ensure consistent data
    const homepageStats = await getStatistics();

    // Fetch daily visitors data directly from the analytics_pageviews table
    const {
      data: rawVisitorData,
      error: dailyError
    } = await supabase.from('analytics_pageviews').select('visited_at, visitor_id').order('visited_at', {
      ascending: false
    }).limit(30);
    if (dailyError) console.error('Error fetching daily visitors:', dailyError);

    // Process visitor data by day
    const visitorsByDay = new Map<string, {
      unique: Set<string>;
      total: number;
    }>();
    if (rawVisitorData) {
      rawVisitorData.forEach(record => {
        const day = new Date(record.visited_at).toISOString().split('T')[0];
        if (!visitorsByDay.has(day)) {
          visitorsByDay.set(day, {
            unique: new Set(),
            total: 0
          });
        }
        const dayData = visitorsByDay.get(day)!;
        dayData.unique.add(record.visitor_id);
        dayData.total += 1;
      });
    }

    // Convert to array format
    const dailyVisitors: DailyVisitorData[] = Array.from(visitorsByDay.entries()).map(([day, data]) => ({
      day,
      unique_visitors: data.unique.size,
      total_visits: data.total
    })).sort((a, b) => b.day.localeCompare(a.day));

    // Fetch country stats directly from analytics_visitors table
    const {
      data: rawCountryData,
      error: countryError
    } = await supabase.from('analytics_visitors').select('country_code, country_name, visitor_id').not('country_code', 'is', null).limit(50);
    if (countryError) console.error('Error fetching country stats:', countryError);

    // Process country data
    const countryMap = new Map<string, {
      country_name: string;
      visitors: Set<string>;
      visits: number;
    }>();
    if (rawCountryData) {
      rawCountryData.forEach(record => {
        if (!record.country_code) return;
        if (!countryMap.has(record.country_code)) {
          countryMap.set(record.country_code, {
            country_name: record.country_name || record.country_code,
            visitors: new Set(),
            visits: 0
          });
        }
        const countryData = countryMap.get(record.country_code)!;
        countryData.visitors.add(record.visitor_id);
        countryData.visits += 1;
      });
    }

    // Convert to array format
    const countryStats: CountryStatsData[] = Array.from(countryMap.entries()).map(([country_code, data]) => ({
      country_code,
      country_name: data.country_name,
      visitor_count: data.visitors.size,
      visit_count: data.visits
    })).sort((a, b) => b.visit_count - a.visit_count);

    // Fetch top scammers
    const {
      data: topScammers,
      error: scammersError
    } = await supabase.from('scammers').select('name, views, bounty_amount, id').order('views', {
      ascending: false
    }).limit(10);
    if (scammersError) console.error('Error fetching top scammers:', scammersError);

    // Process report stats from report_submissions table
    const {
      data: reportStatsRaw,
      error: reportError
    } = await supabase.from('report_submissions').select('created_at, user_id').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    if (reportError) console.error('Error fetching report stats:', reportError);
    const reportStats: ReportStatsData[] = [];
    if (reportStatsRaw) {
      const reportsByDay = new Map<string, {
        reports: number;
        uniqueUsers: Set<string>;
      }>();
      reportStatsRaw.forEach(report => {
        const day = new Date(report.created_at).toISOString().split('T')[0];
        if (!reportsByDay.has(day)) {
          reportsByDay.set(day, {
            reports: 0,
            uniqueUsers: new Set()
          });
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

    // Calculate bounty stats
    const {
      data: bountyContributions,
      error: bountyError
    } = await supabase.from('bounty_contributions').select('amount, scammer_id, contributor_id, is_active').eq('is_active', true);
    if (bountyError) console.error('Error fetching bounty stats:', bountyError);
    const bountyStats: BountyStatsData = {
      total_bounties: homepageStats.totalBounty,
      // Use homepage stats for total bounties
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

    // Format top scammers with additional data
    const processedTopScammers: TopScammerData[] = topScammers ? topScammers.map(scammer => ({
      name: scammer.name,
      views: scammer.views || 0,
      total_bounty: scammer.bounty_amount || 0,
      report_count: 0
    })) : [];
    return {
      dailyVisitors,
      countryStats,
      topScammers: processedTopScammers,
      reportStats,
      bountyStats
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
      }
    };
  }
};
const AnalyticsPage: React.FC = () => {
  // Fetch analytics data 
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
    staleTime: 1000 * 60 * 5
  });

  // Fetch homepage statistics to ensure consistent reporting
  const {
    data: homepageStats
  } = useQuery({
    queryKey: ['statistics'],
    queryFn: getStatistics,
    staleTime: 1000 * 60 * 5
  });
  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;

  // Use homepage statistics for reports count
  const totalReports = homepageStats?.scammersCount || 0;
  return <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          
          
          
          <TabsTrigger value="bounties">Bounties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.dailyVisitors.reduce((sum, day) => sum + day.unique_visitors, 0) || 0}
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
                  {totalReports}
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
                  {data?.dailyVisitors.map((day, index) => <tr key={index} className="border-b">
                      <td>{new Date(day.day).toLocaleDateString()}</td>
                      <td className="text-right">{day.unique_visitors}</td>
                      <td className="text-right">{day.total_visits}</td>
                    </tr>)}
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
                  {data?.countryStats.map((country, index) => <tr key={index} className="border-b">
                      <td>{country.country_name}</td>
                      <td className="text-right">{country.visitor_count}</td>
                      <td className="text-right">{country.visit_count}</td>
                    </tr>)}
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
                  {data?.reportStats.map((day, index) => <tr key={index} className="border-b">
                      <td>{new Date(day.day).toLocaleDateString()}</td>
                      <td className="text-right">{day.report_count}</td>
                      <td className="text-right">{day.unique_reporters}</td>
                    </tr>)}
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
                  <CurrencyIcon size="md" className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(data?.bountyStats?.avg_bounty || 0)}</div>
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
                    {data?.topScammers.map((scammer, index) => <tr key={index} className="border-b">
                        <td>{scammer.name}</td>
                        <td className="text-right">{scammer.views}</td>
                        <td className="text-right">{formatCurrency(scammer.total_bounty)}</td>
                        <td className="text-right">{scammer.report_count}</td>
                      </tr>)}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default AnalyticsPage;