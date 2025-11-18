import React, { useState } from 'react';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { LayoutDashboard, Users, FileText, AlertCircle, BarChart3, Menu, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import ReportManagementSection from '@/components/admin/ReportManagementSection';
import ModerationSection from '@/components/admin/ModerationSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { createAnnouncement, createSurveyAnnouncement } from '@/services/communityService';
import { toast } from '@/hooks/use-toast';
import { Megaphone } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import RichTextEditor from '@/components/community/RichTextEditor';
import SurveyCreator from '@/components/community/SurveyCreator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export type AdminTab = 'overview' | 'analytics' | 'users' | 'reports' | 'moderation';

export default function AdminDashboard() {
  const { loading, isAdmin } = useAdminGuard();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="w-64 border-r border-border bg-card">
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unauthorized Access</h2>
          <p className="text-muted-foreground">
            You don't have permission to access the admin dashboard.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Mobile Home & Menu Buttons */}
        {isMobile && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 right-16 z-50 md:hidden"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="fixed top-4 right-4 z-50 md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-32">
                <AdminSidebar 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  onMobileClose={() => setMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </>
        )}
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 md:p-4">
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'analytics' && <AnalyticsSection />}
            {activeTab === 'users' && <UserManagementSection />}
            {activeTab === 'reports' && <ReportManagementSection />}
            {activeTab === 'moderation' && <ModerationSection />}
          </div>
        </main>
      </div>
    </div>
  );
}

function OverviewSection() {
  const [stats, setStats] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(true);
  const [announcementContent, setAnnouncementContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('post');
  const { profile } = useProfile();

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const tables = ['profiles', 'report_submissions', 'chat_messages'];
        const entries: [string, number][] = [];
        
        for (const table of tables) {
          const { count } = await supabase
            .from(table as any)
            .select('*', { count: 'exact', head: true });
          entries.push([table, count || 0]);
        }
        
        // Count unique bounty contributors
        const { data: contributors } = await supabase
          .from('bounty_contributions')
          .select('contributor_id');
        
        const uniqueContributors = new Set(contributors?.map(c => c.contributor_id).filter(Boolean));
        entries.push(['bounty_hunters', uniqueContributors.size]);
        
        setStats(Object.fromEntries(entries));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCreateAnnouncement = async () => {
    if (!announcementContent.trim()) {
      toast({
        title: "Error",
        description: "Announcement content cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (!profile?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create announcements",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createAnnouncement({
        content: announcementContent,
        author_id: profile.id,
        author_name: profile.display_name || profile.username || 'Anonymous',
        author_username: profile.username || '',
        author_profile_pic: profile.profile_pic_url || '',
        likes: 0,
        dislikes: 0
      });
      toast({
        title: "Success",
        description: "Announcement created successfully"
      });
      setAnnouncementContent('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSurvey = async (title: string, options: string[]) => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create surveys",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createSurveyAnnouncement(
        title,
        options,
        {
          author_id: profile.id,
          author_name: profile.display_name || profile.username || 'Anonymous',
          author_username: profile.username || '',
          author_profile_pic: profile.profile_pic_url || '',
          likes: 0,
          dislikes: 0
        }
      );
      toast({
        title: "Success",
        description: "Poll created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create poll",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin control panel. Monitor and manage your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={loading ? 'Loading...' : stats.profiles || 0}
          icon={Users}
          description="Registered users"
          trend="+12% from last month"
        />
        <StatCard
          title="Active Reports"
          value={loading ? 'Loading...' : stats.report_submissions || 0}
          icon={FileText}
          description="Total reports"
          trend="3 new today"
        />
        <StatCard
          title="Bounty Posters"
          value={loading ? 'Loading...' : stats.bounty_hunters || 0}
          icon={Users}
          description="Active contributors"
          trend="Contributors to bounties"
        />
        <StatCard
          title="Platform Activity"
          value={loading ? 'Loading...' : stats.chat_messages || 0}
          icon={BarChart3}
          description="Chat messages"
          trend="+8% from yesterday"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Create Announcement
        </h3>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post">Post Announcement</TabsTrigger>
            <TabsTrigger value="survey">Create Poll</TabsTrigger>
          </TabsList>
          
          <TabsContent value="post" className="space-y-4">
            <RichTextEditor
              value={announcementContent}
              onChange={setAnnouncementContent}
              placeholder="Write your announcement here..."
              minHeight="200px"
            />
            <Button 
              onClick={handleCreateAnnouncement}
              disabled={isSubmitting || !announcementContent.trim()}
              className="w-full"
            >
              {isSubmitting ? 'Creating...' : 'Post Announcement'}
            </Button>
          </TabsContent>
          
          <TabsContent value="survey">
            <SurveyCreator
              onCreateSurvey={handleCreateSurvey}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Activity
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Use the sidebar to navigate to specific sections for detailed management.</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Analytics - View platform statistics and charts</li>
              <li>User Management - Manage users, bans, and suspensions</li>
              <li>Reports - Review and process user reports</li>
              <li>Moderation - Handle pending content moderation</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Select a section from the sidebar to get started with platform management.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">{trend}</p>
        )}
      </div>
    </Card>
  );
}
