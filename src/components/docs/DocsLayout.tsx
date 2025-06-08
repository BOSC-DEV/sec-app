
import React, { useState } from 'react';
import DocsSidebar from './DocsSidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocsLayoutProps {
  children: React.ReactNode;
}

const DocsLayout = ({ children }: DocsLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0 lg:z-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <DocsSidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden sticky top-0 z-30 bg-background border-b p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Content area */}
          <div className="px-6 py-8 lg:px-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;
