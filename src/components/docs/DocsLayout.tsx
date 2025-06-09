
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
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Fixed height with internal scroll */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-56 transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        h-full overflow-hidden
      `}>
        <DocsSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content - Independent scroll area */}
      <main className="flex-1 min-w-0 flex flex-col h-full lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-background border-b p-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Content area with independent scroll */}
        <div className="flex-1 overflow-y-auto h-full">
          <div className="px-6 py-8 lg:px-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsLayout;
