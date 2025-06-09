
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
    <div className="h-full bg-muted/50 border-r flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6 text-icc-gold" />
            <h2 className="text-lg font-semibold">Documentation</h2>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {filteredItems.map((section) => (
            <Collapsible
              key={section.id}
              open={openSections.includes(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between font-medium text-sm h-9 px-3 hover:bg-accent/50"
                >
                  <span className="text-left">{section.title}</span>
                  {openSections.includes(section.id) ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1">
                <div className="ml-3 border-l border-border/40 pl-3 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        "block px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                        location.pathname === item.path
                          ? "bg-accent text-accent-foreground font-medium border-l-2 border-icc-gold"
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
  );
};

export default DocsSidebar;
