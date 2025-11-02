import React from 'react';
import { LayoutDashboard, BarChart3, Users, FileText, AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AdminTab } from '@/pages/AdminDashboard';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'users' as AdminTab, label: 'User Management', icon: Users },
    { id: 'reports' as AdminTab, label: 'Reports', icon: FileText },
    { id: 'moderation' as AdminTab, label: 'Moderation', icon: AlertCircle },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });

      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen relative">
      <div className="p-6 pb-24">
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

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center gap-3 justify-start"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
