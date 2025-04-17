
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { addBadgeDelegation, getDelegatedBadges, removeBadgeDelegation } from '@/services/badgeDelegationService';
import { useProfile } from '@/contexts/ProfileContext';
import BadgeTier from './BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import { getProfilesByDisplayName } from '@/services/profileService';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const BadgeDelegation: React.FC = () => {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [delegations, setDelegations] = useState<{ delegated_wallet: string; display_name?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<{ display_name: string; wallet_address: string; username?: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadDelegations = async () => {
    if (!profile?.wallet_address) return;
    try {
      const data = await getDelegatedBadges(profile.wallet_address);
      // Only show delegations where the current user is the delegator
      const filteredDelegations = data.filter(d => d.delegator_wallet === profile.wallet_address);
      setDelegations(filteredDelegations);
    } catch (error) {
      console.error('Error loading delegations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load badge delegations',
        variant: 'destructive',
      });
    }
  };

  // Load initial delegations
  useEffect(() => {
    loadDelegations();
  }, [profile?.wallet_address]);

  // Search and load available users
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setAvailableUsers([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    const searchUsers = async () => {
      try {
        const users = await getProfilesByDisplayName(searchQuery);
        // Filter out users who already have delegations or have SEC balance or are the current user
        const filteredUsers = users.filter(user => 
          user.wallet_address !== profile?.wallet_address && 
          !delegations.some(d => d.delegated_wallet === user.wallet_address) &&
          (!user.sec_balance || user.sec_balance === 0)
        );
        setAvailableUsers(filteredUsers);
      } catch (error) {
        console.error('Error searching users:', error);
        setAvailableUsers([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Add debounce to avoid excessive API calls
    const debounceTimer = setTimeout(() => {
      searchUsers();
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, delegations, profile?.wallet_address]);

  const handleAddDelegation = async () => {
    if (!profile?.wallet_address || !selectedUser) return;
    
    setIsLoading(true);
    try {
      await addBadgeDelegation(selectedUser, profile.wallet_address);
      toast({
        title: 'Success',
        description: 'Badge delegation added successfully',
      });
      setSelectedUser('');
      setSelectedUserName('');
      loadDelegations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add badge delegation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDelegation = async (delegatedWallet: string) => {
    if (!profile?.wallet_address) return;
    setIsLoading(true);
    try {
      await removeBadgeDelegation(delegatedWallet, profile.wallet_address);
      toast({
        title: 'Success',
        description: 'Badge delegation removed successfully',
      });
      loadDelegations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove badge delegation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentBadge = profile?.sec_balance ? calculateBadgeTier(profile.sec_balance) : null;

  // Safe way to handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Reset search when popover opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // When closing, wait a bit before clearing search to avoid flicker
      setTimeout(() => {
        setSearchQuery('');
        setAvailableUsers([]);
      }, 100);
    } else {
      // Clear immediately when opening
      setSearchQuery('');
      setAvailableUsers([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge Delegation</CardTitle>
        <CardDescription>
          Allow other users to display your {currentBadge?.tier} badge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Your Current Badge</label>
            <div className="flex items-center space-x-2">
              <BadgeTier badgeInfo={currentBadge} showTooltip={true} />
              <span className="text-sm text-muted-foreground">
                This badge will be shared with delegated users
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Popover open={open} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between w-full"
                >
                  {selectedUserName ? selectedUserName : "Search for a user..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full">
                <Command>
                  <CommandInput 
                    placeholder="Search by username or display name..." 
                    onValueChange={handleSearchChange}
                    value={searchQuery}
                  />
                  {isSearching ? (
                    <div className="py-6 text-center text-sm">Searching...</div>
                  ) : (
                    <>
                      <CommandEmpty>
                        {searchQuery.length < 2 ? "Type at least 2 characters" : "No user found"}
                      </CommandEmpty>
                      {availableUsers && availableUsers.length > 0 && (
                        <CommandGroup>
                          {availableUsers.map((user) => (
                            <CommandItem
                              key={user.wallet_address}
                              value={user.wallet_address}
                              onSelect={() => {
                                setSelectedUser(user.wallet_address);
                                setSelectedUserName(user.display_name || user.username || user.wallet_address);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedUser === user.wallet_address ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {user.display_name || "Unnamed User"} {user.username ? `(@${user.username})` : ""}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            <Button 
              onClick={handleAddDelegation} 
              disabled={isLoading || !selectedUser}
            >
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Current Delegations</h3>
            {delegations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active delegations</p>
            ) : (
              <div className="space-y-2">
                {delegations.map((delegation) => {
                  const displayName = delegation.display_name || delegation.delegated_wallet;
                  return (
                    <div key={delegation.delegated_wallet} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{displayName}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveDelegation(delegation.delegated_wallet)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeDelegation;
