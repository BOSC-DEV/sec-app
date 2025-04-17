
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { addBadgeDelegation, getDelegatedBadges, removeBadgeDelegation } from '@/services/badgeDelegationService';
import { useProfile } from '@/contexts/ProfileContext';
import BadgeTier from './BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import { PublicKey } from '@solana/web3.js';

const BadgeDelegation: React.FC = () => {
  const { profile } = useProfile();
  const [newDelegatedWallet, setNewDelegatedWallet] = useState('');
  const [delegations, setDelegations] = useState<{ delegated_wallet: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    loadDelegations();
  }, [profile?.wallet_address]);

  const validateSolanaAddress = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddDelegation = async () => {
    if (!profile?.wallet_address) return;
    if (!validateSolanaAddress(newDelegatedWallet)) {
      toast({
        title: 'Invalid address',
        description: 'Please enter a valid Solana wallet address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await addBadgeDelegation(newDelegatedWallet, profile.wallet_address);
      toast({
        title: 'Success',
        description: 'Badge delegation added successfully',
      });
      setNewDelegatedWallet('');
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
          Allow other wallets to display your {currentBadge?.tier} badge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Your Current Badge</label>
            <div className="flex items-center space-x-2">
              <BadgeTier badgeInfo={currentBadge} showTooltip={true} />
              <span className="text-sm text-muted-foreground">
                This badge will be shared with delegated wallets
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="Enter wallet address to delegate"
              value={newDelegatedWallet}
              onChange={(e) => setNewDelegatedWallet(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddDelegation} 
              disabled={isLoading || !newDelegatedWallet}
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
                {delegations.map((delegation) => (
                  <div key={delegation.delegated_wallet} className="flex items-center justify-between p-2 border rounded">
                    <code className="text-sm">{delegation.delegated_wallet}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDelegation(delegation.delegated_wallet)}
                      disabled={isLoading}
                    >
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
  );
};

export default BadgeDelegation;
