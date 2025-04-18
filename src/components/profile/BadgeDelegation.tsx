
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { addBadgeDelegation, getDelegatedBadges, removeBadgeDelegation } from '@/services/badgeDelegationService';
import { useProfile } from '@/contexts/ProfileContext';
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { supabase } from '@/integrations/supabase/client';
import DelegationHeader from './DelegationHeader';
import DelegationSearch from './DelegationSearch';
import DelegationList from './DelegationList';

const BadgeDelegation: React.FC = () => {
  const { profile } = useProfile();
  const [delegations, setDelegations] = useState<{ delegated_wallet: string; display_name?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [delegationLimit, setDelegationLimit] = useState<number>(0);
  const [currentDelegations, setCurrentDelegations] = useState<number>(0);

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

  React.useEffect(() => {
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

  const handleAddDelegation = async (selectedUser: string, selectedUserName: string) => {
    if (!profile?.wallet_address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet to delegate badges.',
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

  return (
    <ErrorBoundary>
      <Card>
        <DelegationHeader
          currentDelegations={currentDelegations}
          delegationLimit={delegationLimit}
          secBalance={profile?.sec_balance || null}
        />
        <CardContent>
          <div className="space-y-4">
            <DelegationSearch
              onUserSelect={handleAddDelegation}
              existingDelegations={delegations}
              currentWallet={profile?.wallet_address}
            />
            <DelegationList
              delegations={delegations}
              onRemove={handleRemoveDelegation}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default BadgeDelegation;
