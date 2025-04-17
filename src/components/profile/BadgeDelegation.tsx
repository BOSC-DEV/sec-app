
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { addBadgeDelegation, getDelegatedBadges, removeBadgeDelegation } from '@/services/badgeDelegationService';
import { useProfile } from '@/contexts/ProfileContext';
import BadgeTier from './BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import { getProfilesByDisplayName } from '@/services/profileService';

const BadgeDelegation: React.FC = () => {
  const { profile } = useProfile();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [delegations, setDelegations] = useState<{ delegated_wallet: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<{ display_name: string; wallet_address: string }[]>([]);

  const loadDelegations = async () => {
    if (!profile?.wallet_address) return;
    try {
      const data = await getDelegatedBadges(profile.wallet_address);
      setDelegations(data.filter(d => d.delegator_wallet === profile.wallet_address));
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
    const loadUsers = async () => {
      if (!profile?.display_name) return;
      try {
        const users = await getProfilesByDisplayName("");
        // Filter out users who already have delegations
        const filteredUsers = users.filter(user => 
          user.wallet_address !== profile.wallet_address && 
          !delegations.some(d => d.delegated_wallet === user.wallet_address) &&
          user.sec_balance === 0 // Only show users with no SEC balance
        );
        setAvailableUsers(filteredUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, [profile?.display_name, delegations]);

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
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a user to delegate" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.wallet_address} value={user.wallet_address}>
                    {user.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  const delegatedUser = availableUsers.find(u => u.wallet_address === delegation.delegated_wallet);
                  return (
                    <div key={delegation.delegated_wallet} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{delegatedUser?.display_name || delegation.delegated_wallet}</span>
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
