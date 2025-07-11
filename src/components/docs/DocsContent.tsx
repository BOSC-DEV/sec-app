
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DocsSearchDialog from './DocsSearchDialog';

interface DocsContentProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const DocsContent = ({ children, title, description }: DocsContentProps) => {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Generate table of contents from headings
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingData = Array.from(headingElements).map((heading, index) => {
      let id = heading.id;
      
      // Generate ID from text if not present
      if (!id && heading.textContent) {
        id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        
        // Ensure uniqueness
        if (document.getElementById(id)) {
          id = `${id}-${index}`;
        }
        
        heading.id = id;
      }
      
      return {
        id: id || `heading-${index}`,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      };
    });
    setHeadings(headingData);
  }, [children]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "URL Copied",
      description: "Page URL has been copied to clipboard",
    });
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Page header */}
            <header className="mb-8 pb-6 border-b">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSearchOpen(true)}
                    title="Search docs (Ctrl+K)"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={copyUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {description && (
                <p className="text-xl text-muted-foreground">{description}</p>
              )}
            </header>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/BOSC-DEV/sec-platform" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Edit on GitHub
                  </a>
                </Button>
              </div>
            </footer>
          </div>

          {/* Table of contents - Moved closer to edge with reduced width */}
          {headings.length > 0 && (
            <aside className="w-52 shrink-0 lg:block hidden">
              <div className="sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-hidden border rounded-lg bg-muted/30 mr-2">
                <div className="p-3 border-b bg-muted/50">
                  <h3 className="font-semibold text-sm">On this page</h3>
                </div>
                <nav className="p-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
                  <div className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`
                          block text-sm transition-colors hover:text-foreground
                          ${heading.level === 1 ? 'font-medium' : 'text-muted-foreground'}
                          ${heading.level > 2 ? 'ml-3' : ''}
                          ${heading.level > 3 ? 'ml-6' : ''}
                        `}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Search Dialog */}
      <DocsSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default DocsContent;
