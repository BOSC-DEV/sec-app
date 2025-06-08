
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DocsContentProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const DocsContent = ({ children, title, description }: DocsContentProps) => {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    // Generate table of contents from headings
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingData = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      };
    });
    setHeadings(headingData);
  }, [children]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "URL Copied",
      description: "Page URL has been copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Page header */}
          <header className="mb-8 pb-6 border-b">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
              <Button variant="ghost" size="icon" onClick={copyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
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

        {/* Table of contents */}
        {headings.length > 0 && (
          <aside className="w-64 shrink-0">
            <div className="sticky top-8">
              <h3 className="font-semibold text-sm mb-4">On this page</h3>
              <nav className="space-y-2">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`
                      block text-sm transition-colors hover:text-foreground
                      ${heading.level === 1 ? 'font-medium' : 'text-muted-foreground'}
                      ${heading.level > 2 ? 'ml-4' : ''}
                      ${heading.level > 3 ? 'ml-8' : ''}
                    `}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DocsContent;
