
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Flag } from 'lucide-react';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { supabase } from '@/integrations/supabase/client';
import { Scammer, Profile } from '@/types/dataTypes';
import { Button } from '@/components/ui/button';

interface GlobalSearchProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, setIsOpen }) => {
  const [scammers, setScammers] = useState<Scammer[]>([]);
  const [reporters, setReporters] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Reset search when opening
      setSearchQuery('');
      setScammers([]);
      setReporters([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setScammers([]);
        setReporters([]);
        return;
      }

      setIsLoading(true);
      try {
        // Search for scammers
        const { data: scammerData, error: scammerError } = await supabase
          .from('scammers')
          .select('*')
          .or(`name.ilike.%${searchQuery}%,accused_of.ilike.%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(5);

        if (scammerError) throw scammerError;
        setScammers(scammerData || []);

        // Search for reporters (profiles)
        const { data: reporterData, error: reporterError } = await supabase
          .from('profiles')
          .select('*')
          .or(`display_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
          .limit(5);

        if (reporterError) throw reporterError;
        setReporters(reporterData || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelect = (type: 'scammer' | 'reporter', id: string) => {
    setIsOpen(false);
    if (type === 'scammer') {
      navigate(`/scammer/${id}`);
    } else {
      // For reporters, check if they have a username to create a nicer URL
      const reporter = reporters.find(r => r.id === id);
      if (reporter?.username) {
        navigate(`/${reporter.username}`);
      } else {
        navigate(`/profile/${id}`);
      }
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Search for scammers or reporters..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? (
              <div className="py-6 text-center text-sm">
                Searching...
              </div>
            ) : (
              <div className="py-6 text-center text-sm">
                No results found. Try a different search term.
              </div>
            )}
          </CommandEmpty>
          
          {scammers.length > 0 && (
            <CommandGroup heading="Scammers">
              {scammers.map((scammer) => (
                <CommandItem
                  key={scammer.id}
                  onSelect={() => handleSelect('scammer', scammer.id)}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="flex-shrink-0">
                    <Flag className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{scammer.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                      {scammer.accused_of || 'Reported scammer'}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {reporters.length > 0 && (
            <CommandGroup heading="Reporters">
              {reporters.map((reporter) => (
                <CommandItem
                  key={reporter.id}
                  onSelect={() => handleSelect('reporter', reporter.id)}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="flex-shrink-0">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{reporter.display_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {reporter.username ? `@${reporter.username}` : 'Reporter'}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default GlobalSearch;
