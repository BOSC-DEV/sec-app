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
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from '@/types/dataTypes';
import ErrorBoundary from "@/components/common/ErrorBoundary";

const BadgeDelegation: React.FC = () => {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [delegations, setDelegations] = useState<{ delegated_wallet: string; display_name?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadDelegations = async () => {
    if (!profile?.wallet_address) return;
    try {
      const data = await getDelegatedBadges(profile.wallet_address);
      const filteredDelegations = data.filter(d => d.delegator_wallet === profile.wallet_address);
      setDelegations(filteredDelegations);
    } catch (error) {
      console.error('Error loading delegations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load badge delegations. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadDelegations();
  }, [profile?.wallet_address]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setAvailableUsers([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      
      try {
        const users = await getProfilesByDisplayName(searchQuery);
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

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, delegations, profile?.wallet_address]);

  const handleAddDelegation = async () => {
    if (!profile?.wallet_address || !selectedUser) {
      toast({
        title: 'Error',
        description: 'Please select a user to delegate your badge to.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await addBadgeDelegation(selectedUser, profile.wallet_address);
      toast({
        title: 'Success',
        description: 'Badge delegation added successfully',
      });
      setSelectedUser('');
      setSelectedUserName('');
      await loadDelegations();
    } catch (error) {
      console.error('Error adding delegation:', error);
      toast({
        title: 'Error',
        description: 'Failed to add badge delegation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleRemoveDelegation = async (delegatedWallet: string) => {
    if (!profile?.wallet_address) {
      toast({
        title: 'Error',
        description: 'You must be logged in to remove delegations.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await removeBadgeDelegation(delegatedWallet, profile.wallet_address);
      toast({
        title: 'Success',
        description: 'Badge delegation removed successfully',
      });
      await loadDelegations();
    } catch (error) {
      console.error('Error removing delegation:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove badge delegation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentBadge = profile?.sec_balance ? calculateBadgeTier(profile.sec_balance) : null;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery('');
      setAvailableUsers([]);
    }
  };

  return (
    <ErrorBoundary>
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
                    disabled={isLoading}
                  >
                    {selectedUserName ? selectedUserName : "Search for a user..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[400px]">
                  <Command>
                    <CommandInput 
                      placeholder="Search by username or display name..." 
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      {isSearching && (
                        <div className="py-6 text-center text-sm">Searching...</div>
                      )}
                      {!isSearching && (
                        <>
                          <CommandEmpty>
                            {searchQuery.length < 2 
                              ? "Type at least 2 characters to search" 
                              : "No users found"}
                          </CommandEmpty>
                          <CommandGroup>
                            {availableUsers && availableUsers.map((user) => (
                              <CommandItem
                                key={user.wallet_address}
                                value={user.wallet_address}
                                onSelect={() => {
                                  setSelectedUser(user.wallet_address);
                                  setSelectedUserName(user.display_name);
                                  setOpen(false);
                                  setSearchQuery('');
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedUser === user.wallet_address ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {user.display_name} {user.username ? `(@${user.username})` : ""}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button 
                onClick={handleAddDelegation} 
                disabled={isLoading || !selectedUser}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Delegations</h3>
              {delegations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active delegations</p>
              ) : (
                <div className="space-y-2">
                  {delegations.map((delegation) => (
                    <div key={delegation.delegated_wallet} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{delegation.display_name || delegation.delegated_wallet}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveDelegation(delegation.delegated_wallet)}
                        disabled={isLoading}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default BadgeDelegation;
