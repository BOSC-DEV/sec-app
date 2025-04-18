
import React from 'react';
import { BarChart, Users, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchVisitorStats = async () => {
  // Fetch daily visitors
  const { data: dailyVisitors, error: dailyError } = await supabase
    .rpc('get_daily_visitors', {});

  if (dailyError) {
    console.error('Error fetching daily visitors:', dailyError);
    return null;
  }

  // Fetch country statistics
  const { data: countryStats, error: countryError } = await supabase
    .rpc('get_country_stats', {});

  if (countryError) {
    console.error('Error fetching country stats:', countryError);
    return null;
  }

  return { dailyVisitors, countryStats };
};

const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['visitorStats'],
    queryFn: fetchVisitorStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.dailyVisitors?.[0]?.unique_visitors || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.dailyVisitors?.[0]?.total_visits || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Countries</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.countryStats?.length || 0}
                </div>
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
                  {data?.dailyVisitors?.map((day, index) => (
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
                  {data?.countryStats?.map((country, index) => (
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
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;

