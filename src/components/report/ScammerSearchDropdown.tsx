
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Loader2, AlertCircle } from 'lucide-react';
import { searchScammers } from '@/services/scammerSearchService';
import type { Scammer } from '@/types/dataTypes';
import { toast } from '@/hooks/use-toast';

interface ScammerSearchDropdownProps {
  searchTerm: string;
  onScammerSelect: (scammer: Scammer) => void;
}

const ScammerSearchDropdown: React.FC<ScammerSearchDropdownProps> = ({
  searchTerm,
  onScammerSelect,
}) => {
  const { data: scammers = [], isLoading } = useQuery({
    queryKey: ['scammerSearch', searchTerm],
    queryFn: () => searchScammers(searchTerm),
    enabled: searchTerm.length >= 2,
  });

  const handleSelect = (scammer: Scammer) => {
    onScammerSelect(scammer);
    toast({
      title: "Similar scammer found",
      description: "Please verify if this is the same scammer you're trying to report.",
    });
  };

  if (searchTerm.length < 2) return null;

  // A simpler rendering approach to avoid any potential issues with the Command component
  return (
    <div className="rounded-lg border shadow-md mt-1 bg-background">
      <div className="flex items-center border-b px-3 py-2">
        <span className="text-sm text-muted-foreground">Searching: {searchTerm}</span>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Searching...
        </div>
      ) : (
        <div className="p-1">
          {scammers.length === 0 ? (
            <div className="py-6 text-sm text-center text-muted-foreground">
              No similar scammers found
            </div>
          ) : (
            <div>
              {scammers.map((scammer) => (
                <div 
                  key={scammer.id}
                  className="flex items-start gap-2 p-3 hover:bg-accent rounded-sm cursor-pointer"
                  onClick={() => handleSelect(scammer)}
                >
                  <AlertCircle className="h-4 w-4 mt-1 flex-shrink-0 text-yellow-500" />
                  <div className="flex flex-col">
                    <div className="font-medium">{scammer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {scammer.accused_of ? `${scammer.accused_of.substring(0, 100)}...` : 'No description available'}
                    </div>
                    {scammer.wallet_addresses?.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Wallet: {scammer.wallet_addresses[0]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScammerSearchDropdown;
