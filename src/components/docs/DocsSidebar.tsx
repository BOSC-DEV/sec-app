
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search, X, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocsSidebarProps {
  onClose?: () => void;
}

const DocsSidebar = ({ onClose }: DocsSidebarProps) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<string[]>(['getting-started', 'features']);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const navigationItems = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      items: [
        { title: 'Overview', path: '/docs' },
        { title: 'Vision & Mission', path: '/docs/vision' },
        { title: 'Quick Start', path: '/docs/quick-start' },
      ]
    },
    {
      id: 'features',
      title: 'Features',
      items: [
        { title: 'Scammer Reporting', path: '/docs/features/reporting' },
        { title: 'Phantom Wallet', path: '/docs/features/wallet' },
        { title: 'Bounty System', path: '/docs/features/bounty' },
        { title: 'Badge & Tier System', path: '/docs/features/badges' },
        { title: 'Community Features', path: '/docs/features/community' },
        { title: 'Search & Navigation', path: '/docs/features/search' },
        { title: 'Leaderboard', path: '/docs/features/leaderboard' },
        { title: 'Notifications', path: '/docs/features/notifications' },
      ]
    },
    {
      id: 'technical',
      title: 'Technical Documentation',
      items: [
        { title: 'Architecture', path: '/docs/technical/architecture' },
        { title: 'Frontend Stack', path: '/docs/technical/frontend' },
        { title: 'Backend Integration', path: '/docs/technical/backend' },
        { title: 'Database Schema', path: '/docs/technical/database' },
        { title: 'Security Features', path: '/docs/technical/security' },
      ]
    },
    {
      id: 'user-guide',
      title: 'User Guide',
      items: [
        { title: 'Creating Reports', path: '/docs/guide/reports' },
        { title: 'Managing Bounties', path: '/docs/guide/bounties' },
        { title: 'Using Wallet Features', path: '/docs/guide/wallet' },
        { title: 'Community Participation', path: '/docs/guide/community' },
      ]
    },
    {
      id: 'developer',
      title: 'Developer Resources',
      items: [
        { title: 'API Reference', path: '/docs/developer/api' },
        { title: 'Contributing', path: '/docs/developer/contributing' },
        { title: 'Deployment', path: '/docs/developer/deployment' },
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Compliance',
      items: [
        { title: 'Terms of Service', path: '/docs/legal/terms' },
        { title: 'Privacy Policy', path: '/docs/legal/privacy' },
        { title: 'Legal Considerations', path: '/docs/legal/considerations' },
        { title: 'Tokenomics', path: '/docs/legal/tokenomics' },
      ]
    }
  ];

  const filteredItems = navigationItems.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="h-full bg-background border-r flex flex-col overflow-hidden z-50">
      {/* Header - Fixed */}
      <div className="p-4 border-b flex-shrink-0 bg-background">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-icc-gold" />
            <h2 className="text-base font-semibold">Documentation</h2>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm bg-background"
          />
        </div>
      </div>

      {/* Navigation - Scrollable container that doesn't affect parent */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
        <nav className="p-2">
          <div className="space-y-0.5">
            {filteredItems.map((section) => (
              <Collapsible
                key={section.id}
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between font-medium text-xs h-7 px-2 hover:bg-accent/50"
                  >
                    <span className="text-left truncate">{section.title}</span>
                    {openSections.includes(section.id) ? (
                      <ChevronDown className="h-3 w-3 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3 w-3 shrink-0" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-0.5">
                  <div className="ml-0 pl-0 space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={cn(
                          "block px-2 py-1.5 text-xs rounded transition-colors hover:bg-accent hover:text-accent-foreground truncate",
                          location.pathname === item.path
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DocsSidebar;
