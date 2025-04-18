
import React from 'react';
import { BarChart, Users, Globe, TrendingUp, Shield, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define types for all the stats
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

const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  const [
    { data: dailyVisitors, error: dailyError },
    { data: countryStats, error: countryError },
    { data: topScammers, error: scammersError },
    { data: reportStats, error: reportError },
    { data: bountyStats, error: bountyError }
  ] = await Promise.all([
    supabase.rpc('get_daily_visitors'),
    supabase.rpc('get_country_stats'),
    supabase.rpc('get_top_scammers'),
    supabase.rpc('get_report_stats'),
    supabase.rpc('get_bounty_stats')
  ]);

  if (dailyError) console.error('Error fetching daily visitors:', dailyError);
  if (countryError) console.error('Error fetching country stats:', countryError);
  if (scammersError) console.error('Error fetching top scammers:', scammersError);
  if (reportError) console.error('Error fetching report stats:', reportError);
  if (bountyError) console.error('Error fetching bounty stats:', bountyError);

  return {
    dailyVisitors: dailyVisitors || [],
    countryStats: countryStats || [],
    topScammers: topScammers || [],
    reportStats: reportStats || [],
    bountyStats: bountyStats?.[0] || {
      total_bounties: 0,
      active_bounties: 0,
      avg_bounty: 0,
      total_contributors: 0
    }
  };
};

const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="bounties">Bounties</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
