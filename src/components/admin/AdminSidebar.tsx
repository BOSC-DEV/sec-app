import React from 'react';
import { LayoutDashboard, BarChart3, Users, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTab } from '@/pages/AdminDashboard';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'users' as AdminTab, label: 'User Management', icon: Users },
    { id: 'reports' as AdminTab, label: 'Reports', icon: FileText },
    { id: 'moderation' as AdminTab, label: 'Moderation', icon: AlertCircle },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">Management Console</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                'hover:bg-muted/50',
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
