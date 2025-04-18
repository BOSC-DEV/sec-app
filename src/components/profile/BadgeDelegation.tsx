import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { addBadgeDelegation, getDelegatedBadges, removeBadgeDelegation } from '@/services/badgeDelegationService';
import { useProfile } from '@/contexts/ProfileContext';
import BadgeTier from './BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import { getProfilesByDisplayName } from '@/services/profileService';
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { supabase } from '@/integrations/supabase/client';

const BadgeDelegation: React.FC = () => {
  const { profile } = useProfile();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [delegations, setDelegations] = useState<{ delegated_wallet: string; display_name?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [delegationLimit, setDelegationLimit] = useState<number>(0);
  const [currentDelegations, setCurrentDelegations] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);

  const loadDelegations = useCallback(async () => {
    if (!profile?.wallet_address) return;
    
    try {
      setIsLoading(true);
      console.log('Loading delegations for wallet:', profile.wallet_address);
      const delegationsData = await getDelegatedBadges(profile.wallet_address);
      console.log('Delegations data:', delegationsData);
      
      const activeDelegations = delegationsData.filter(d => 
        d.delegator_wallet === profile.wallet_address && d.active
      );
      console.log('Active delegations:', activeDelegations);
      
      setDelegations(activeDelegations);
      setCurrentDelegations(activeDelegations.length);
    } catch (error) {
      console.error('Error loading delegations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load delegations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [profile?.wallet_address]);

  useEffect(() => {
    const loadDelegationInfo = async () => {
      if (!profile?.wallet_address) return;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('delegation_limit')
          .eq('wallet_address', profile.wallet_address)
          .single();

        if (profileError) throw profileError;
        setDelegationLimit(profileData?.delegation_limit || 0);

        await loadDelegations();
      } catch (error) {
        console.error('Error loading delegation info:', error);
        toast({
          title: 'Error',
          description: 'Failed to load delegation information',
          variant: 'destructive',
        });
      }
    };
    
    loadDelegationInfo();
  }, [profile?.wallet_address, loadDelegations]);

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
        // Filter out users who:
        // 1. Are the current user
        // 2. Already have a badge (SEC balance > 0)
        // 3. Already have an active delegation
        // 4. Are already in the current delegations list
        const filteredUsers = users.filter(user => {
          const hasBalance = user.sec_balance && user.sec_balance > 0;
          const isCurrentUser = user.wallet_address === profile?.wallet_address;
          const isAlreadyDelegated = delegations.some(d => d.delegated_wallet === user.wallet_address);
          
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

    const delegatorDelegations = await getDelegatedBadges(profile.wallet_address);
    const isDelegated = delegatorDelegations.some(d => 
      d.delegated_wallet === profile.wallet_address && 
      d.active
    );

    if (isDelegated) {
      const delegator = delegatorDelegations.find(d => 
        d.delegated_wallet === profile.wallet_address && 
        d.active
      );

      if (delegator) {
        const { data: delegatorProfile } = await supabase
          .from('profiles')
          .select('sec_balance')
          .eq('wallet_address', delegator.delegator_wallet)
          .single();

        const ownBadge = profile.sec_balance ? calculateBadgeTier(profile.sec_balance) : null;
        const delegatorBadge = delegatorProfile?.sec_balance ? calculateBadgeTier(delegatorProfile.sec_balance) : null;

        if (!ownBadge || !delegatorBadge || 
            getBadgeTierRank(ownBadge.tier) <= getBadgeTierRank(delegatorBadge.tier)) {
          toast({
            title: 'Cannot Delegate',
            description: 'You cannot delegate badges while using a delegated badge unless you have your own higher tier badge.',
            variant: 'destructive',
          });
          return;
        }
      }
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
      console.log(`Removing delegation from ${profile.wallet_address} to ${delegatedWallet}`);
      await removeBadgeDelegation(delegatedWallet, profile.wallet_address);
      
      toast({
        title: 'Success',
        description: 'Badge delegation removed successfully',
      });
      
      // Force refresh delegations list and count
      await loadDelegations();
      
      // Remove from local state immediately to update UI
      setDelegations(current => 
        current.filter(d => d.delegated_wallet !== delegatedWallet)
      );
      setCurrentDelegations(prev => Math.max(0, prev - 1));
      
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

  const getBadgeTierRank = (tier: string) => {
    const tiers = [
      'Shrimp', 'Frog', 'Bull', 'Lion', 'King Cobra',
      'Bull Shark', 'Great Ape', 'Bald Eagle', 'Goat', 'T-Rex', 'Whale'
    ];
    return tiers.indexOf(tier);
  };

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Badge Delegation</CardTitle>
          <CardDescription>
            Allow other users to display your {currentBadge?.tier} badge
            {(delegationLimit > 0 || profile?.sec_balance === null) && (
              <div className="mt-1 text-sm text-muted-foreground">
                Delegation limit: {currentDelegations} / {profile?.sec_balance === null ? 0 : delegationLimit}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                            setSelectedUser(user.wallet_address);
                            setSelectedUserName(user.display_name);
                            setSearchQuery('');
                            setShowResults(false);
                            handleAddDelegation();
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
