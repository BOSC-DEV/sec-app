import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, FileText, MessageSquare, DollarSign, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AnalyticsSection() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const tables = ['profiles', 'scammers', 'bounty_contributions', 'report_submissions', 'announcements', 'chat_messages'];
      const entries: [string, number][] = [];
      
      for (const table of tables) {
        const { count } = await supabase
          .from(table as any)
          .select('*', { count: 'exact', head: true });
        entries.push([table, count || 0]);
      }
      
      setStats(Object.fromEntries(entries));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Profiles', value: stats.profiles || 0 },
    { name: 'Scammers', value: stats.scammers || 0 },
    { name: 'Reports', value: stats.report_submissions || 0 },
    { name: 'Announcements', value: stats.announcements || 0 },
    { name: 'Chat', value: stats.chat_messages || 0 },
    { name: 'Bounties', value: stats.bounty_contributions || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Analytics Overview</h1>
        <p className="text-muted-foreground">
          Platform statistics and performance metrics
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse">Loading analytics...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Users"
              value={stats.profiles || 0}
              icon={Users}
              color="text-blue-600"
              bgColor="bg-blue-100 dark:bg-blue-900/20"
            />
            <StatCard
              title="Scammer Reports"
              value={stats.scammers || 0}
              icon={AlertCircle}
              color="text-red-600"
              bgColor="bg-red-100 dark:bg-red-900/20"
            />
            <StatCard
              title="Report Submissions"
              value={stats.report_submissions || 0}
              icon={FileText}
              color="text-purple-600"
              bgColor="bg-purple-100 dark:bg-purple-900/20"
            />
            <StatCard
              title="Bounty Contributions"
              value={stats.bounty_contributions || 0}
              icon={DollarSign}
              color="text-green-600"
              bgColor="bg-green-100 dark:bg-green-900/20"
            />
            <StatCard
              title="Announcements"
              value={stats.announcements || 0}
              icon={BarChart3}
              color="text-yellow-600"
              bgColor="bg-yellow-100 dark:bg-yellow-900/20"
            />
            <StatCard
              title="Chat Messages"
              value={stats.chat_messages || 0}
              icon={MessageSquare}
              color="text-indigo-600"
              bgColor="bg-indigo-100 dark:bg-indigo-900/20"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Growth Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>
    </Card>
  );
}
