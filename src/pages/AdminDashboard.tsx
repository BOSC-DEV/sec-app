import React, { useState } from 'react';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { LayoutDashboard, Users, FileText, AlertCircle, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AnalyticsSection from '@/components/admin/AnalyticsSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import ReportManagementSection from '@/components/admin/ReportManagementSection';
import ModerationSection from '@/components/admin/ModerationSection';

export type AdminTab = 'overview' | 'analytics' | 'users' | 'reports' | 'moderation';

export default function AdminDashboard() {
  const { loading, isAdmin } = useAdminGuard();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

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
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
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
          value="Loading..."
          icon={Users}
          description="Registered users"
          trend="+12% from last month"
        />
        <StatCard
          title="Active Reports"
          value="Loading..."
          icon={FileText}
          description="Pending reports"
          trend="3 new today"
        />
        <StatCard
          title="Total Scammers"
          value="Loading..."
          icon={AlertCircle}
          description="In database"
          trend="+5 this week"
        />
        <StatCard
          title="Platform Activity"
          value="Loading..."
          icon={BarChart3}
          description="Daily interactions"
          trend="+8% from yesterday"
        />
      </div>

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
