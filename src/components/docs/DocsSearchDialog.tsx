
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Hash, ExternalLink } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { docsSearchService, SearchResult } from '@/services/docsSearchService';

interface DocsSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocsSearchDialog = ({ open, onOpenChange }: DocsSearchDialogProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = docsSearchService.search(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    let navigationPath = result.path;
    
    // Add section anchor if available
    if (result.sectionId) {
      navigationPath += `#${result.sectionId}`;
    }
    
    navigate(navigationPath);
    onOpenChange(false);
    
    // Scroll to section after navigation
    if (result.sectionId) {
      setTimeout(() => {
        const element = document.getElementById(result.sectionId!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Temporarily highlight the section
          element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          setTimeout(() => {
            element.style.backgroundColor = '';
          }, 2000);
        }
      }, 100);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <FileText className="h-4 w-4" />;
      case 'section':
        return <Hash className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'page':
        return 'Page';
      case 'section':
        return 'Section';
      default:
        return 'Content';
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search documentation..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.length > 1 ? 'No results found.' : 'Type to search documentation...'}
        </CommandEmpty>
        
        {results.length > 0 && (
          <CommandGroup heading="Search Results">
            {results.map((result) => (
              <CommandItem
                key={result.id}
                value={result.id}
                onSelect={() => handleSelect(result)}
                className="flex flex-col items-start py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  {getResultIcon(result.type)}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{result.title}</span>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {getResultTypeLabel(result.type)}
                      </span>
                    </div>
                    {result.section && (
                      <span className="text-sm text-muted-foreground truncate">
                        in {result.section}
                      </span>
                    )}
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <p 
                  className="text-sm text-muted-foreground mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: docsSearchService.getHighlightedContent(
                      docsSearchService.generateExcerpt(result.content, query),
                      query
                    )
                  }}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default DocsSearchDialog;
