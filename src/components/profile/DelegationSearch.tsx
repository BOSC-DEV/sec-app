
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';
import { getProfilesByDisplayName } from '@/services/profileService';

interface SearchResult {
  wallet_address: string;
  display_name: string;
  username?: string;
  sec_balance?: number;
}

interface DelegationSearchProps {
  onUserSelect: (wallet: string, displayName: string) => void;
  existingDelegations: { delegated_wallet: string }[];
  currentWallet?: string;
}

const DelegationSearch: React.FC<DelegationSearchProps> = ({
  onUserSelect,
  existingDelegations,
  currentWallet
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setAvailableUsers([]);
        setIsSearching(false);
        setShowResults(false);
        return;
      }
      
      setIsSearching(true);
      setShowResults(true);
      
      try {
        const users = await getProfilesByDisplayName(searchQuery);
        const filteredUsers = users.filter(user => {
          const hasBalance = user.sec_balance && user.sec_balance > 0;
          const isCurrentUser = user.wallet_address === currentWallet;
          const isAlreadyDelegated = existingDelegations.some(d => 
            d.delegated_wallet === user.wallet_address
          );
          
          return !hasBalance && !isCurrentUser && !isAlreadyDelegated;
        });
        
        setAvailableUsers(filteredUsers);
      } catch (error) {
        console.error('Error searching users:', error);
        setAvailableUsers([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, existingDelegations, currentWallet]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for users to delegate your badge..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {showResults && (searchQuery.length >= 2) && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {isSearching ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : availableUsers.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {searchQuery.length < 2 
                ? "Type at least 2 characters to search" 
                : "No eligible users found"}
            </div>
          ) : (
            <div className="max-h-[200px] overflow-y-auto">
              {availableUsers.map((user) => (
                <div
                  key={user.wallet_address}
                  className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer"
                  onClick={() => {
                    onUserSelect(user.wallet_address, user.display_name);
                    setSearchQuery('');
                    setShowResults(false);
                  }}
                >
                  <span>{user.display_name} {user.username ? `(@${user.username})` : ""}</span>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DelegationSearch;
