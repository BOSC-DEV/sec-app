
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BountyContribution, Scammer } from '@/types/dataTypes';
import { useProfile } from '@/contexts/ProfileContext';
import { Progress } from '@/components/ui/progress';
import { ArrowRightIcon, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { transferBountyContribution, getUserTransferableContributions } from '@/services/bounty/bountyService';
import { getScammerById } from '@/services/scammerService';
import { formatCurrency } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CurrencyIcon from '@/components/common/CurrencyIcon';

interface BountyTransferDialogProps {
  scammerId: string;
  scammerName: string;
  onTransferComplete?: () => void;
}

const BountyTransferDialog: React.FC<BountyTransferDialogProps> = ({
  scammerId,
  scammerName,
  onTransferComplete
}) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState<string>('0');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [sourceContributions, setSourceContributions] = useState<BountyContribution[]>([]);
  const [selectedContribution, setSelectedContribution] = useState<BountyContribution | null>(null);
  const [maxTransferAmount, setMaxTransferAmount] = useState<number>(0);
  const [alreadyTransferred, setAlreadyTransferred] = useState<number>(0);

  // Fetch user's transferable contributions
  const fetchTransferableContributions = async () => {
    if (!profile?.wallet_address || !isOpen) return;
    
    setIsLoading(true);
    try {
      // Get all transferable contributions except ones already on this scammer
      const contributions = await getUserTransferableContributions(profile.wallet_address, scammerId);
      setSourceContributions(contributions);
    } catch (error) {
      console.error("Error fetching transferable contributions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your transferable contributions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchTransferableContributions();
    } else {
      // Reset state when dialog closes
      setSelectedContribution(null);
      setTransferAmount('0');
      setMaxTransferAmount(0);
      setAlreadyTransferred(0);
    }
  }, [profile?.wallet_address, scammerId, isOpen]);

  // Calculate already transferred amount when selecting a contribution
  const calculateAlreadyTransferred = async (contributionId: string) => {
    if (!contributionId) return 0;
    
    try {
      // Find all transfers from this contribution
      const { data, error } = await supabase
        .from("bounty_contributions")
        .select("amount")
        .eq("transferred_from_id", contributionId)
        .eq("is_active", true);
      
      if (error) throw error;
      
      // Sum up all transferred amounts
      const totalTransferred = data.reduce((sum, item) => sum + Number(item.amount), 0);
      return totalTransferred;
    } catch (error) {
      console.error("Error calculating transferred amount:", error);
      return 0;
    }
  };

  // Update max transfer amount when selected contribution changes
  useEffect(() => {
    if (selectedContribution) {
      const fetchTransferInfo = async () => {
        // Calculate how much has already been transferred from this contribution
        const transferred = await calculateAlreadyTransferred(selectedContribution.id);
        setAlreadyTransferred(transferred);
        
        // Max is 90% of the original contribution minus already transferred amount
        const maxTotal = selectedContribution.amount * 0.9;
        const remainingTransferable = maxTotal - transferred;
        
        setMaxTransferAmount(Math.max(0, remainingTransferable));
        
        // Default to max amount or reset if no more available
        if (remainingTransferable > 0) {
          setTransferAmount(remainingTransferable.toFixed(2));
        } else {
          setTransferAmount('0');
        }
      };
      
      fetchTransferInfo();
    } else {
      setMaxTransferAmount(0);
      setTransferAmount('0');
      setAlreadyTransferred(0);
    }
  }, [selectedContribution]);

  const handleSelectContribution = (contributionId: string) => {
    const contribution = sourceContributions.find(c => c.id === contributionId);
    setSelectedContribution(contribution || null);
  };

  const handleTransferAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Validate input
    if (!value || isNaN(parseFloat(value))) {
      setTransferAmount('0');
      return;
    }
    
    const amount = parseFloat(value);
    
    // Ensure it's not more than max allowed
    if (amount > maxTransferAmount) {
      setTransferAmount(maxTransferAmount.toFixed(2));
      return;
    }
    
    setTransferAmount(value);
  };

  const handleTransferRequest = () => {
    // Validation
    if (!selectedContribution) {
      toast({
        title: "Error",
        description: "Please select a contribution to transfer from",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid transfer amount",
        variant: "destructive"
      });
      return;
    }
    
    // Check against 90% total limit including already transferred
    const maxTotal = selectedContribution.amount * 0.9;
    if (amount + alreadyTransferred > maxTotal) {
      toast({
        title: "Error",
        description: `You can only transfer up to 90% (${maxTotal.toFixed(2)} $SEC) in total from this contribution`,
        variant: "destructive"
      });
      return;
    }
    
    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };

  const handleConfirmTransfer = async () => {
    if (!profile || !selectedContribution) return;
    
    setIsLoading(true);
    try {
      await transferBountyContribution(
        selectedContribution.id,
        scammerId,
        parseFloat(transferAmount),
        profile.wallet_address,
        profile.display_name,
        profile.profile_pic_url
      );
      
      toast({
        title: "Success",
        description: `Successfully transferred ${transferAmount} $SEC to ${scammerName}`
      });
      
      // Reset state
      setSelectedContribution(null);
      setTransferAmount('0');
      setConfirmDialogOpen(false);
      
      // Close the dialog
      setIsOpen(false);
      
      // Trigger callback for parent to refresh data
      if (onTransferComplete) {
        onTransferComplete();
      }
    } catch (error) {
      console.error("Transfer error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transfer contribution",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        // If dialog is closed, reset state to avoid stale data
        if (!open) {
          setSelectedContribution(null);
          setTransferAmount('0');
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <ArrowRightIcon className="h-4 w-4 mr-2" /> 
            Transfer from Another Bounty
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transfer Bounty to {scammerName}</DialogTitle>
            <DialogDescription>
              Transfer funds from one of your existing bounty contributions to this scammer.
              Note: At least 10% of the original contribution must remain with the original scammer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {sourceContributions.length === 0 && !isLoading ? (
              <div className="text-center p-4 bg-amber-50 text-amber-700 rounded-md">
                <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                <p className="font-medium">No transferable contributions found</p>
                <p className="text-sm mt-1">You need to have contributed to other scammers before you can transfer.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="source-contribution">Source Contribution</Label>
                  <Select 
                    onValueChange={handleSelectContribution} 
                    disabled={isLoading || sourceContributions.length === 0}
                  >
                    <SelectTrigger id="source-contribution">
                      <SelectValue placeholder="Select a contribution to transfer from" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceContributions.map((contribution) => (
                        <SelectItem key={contribution.id} value={contribution.id}>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage 
                                src={contribution.scammers?.photo_url || '/placeholder.svg'} 
                                alt={contribution.scammers?.name || 'Scammer'} 
                              />
                              <AvatarFallback>
                                {(contribution.scammers?.name || 'S').substring(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {contribution.scammers?.name} ({formatCurrency(contribution.amount)} <CurrencyIcon size="sm" />)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedContribution && (
                  <>
                    {alreadyTransferred > 0 && (
                      <div className="text-sm text-amber-600 p-3 bg-amber-50 rounded-md">
                        <p className="font-medium">Already transferred: {formatCurrency(alreadyTransferred)} <CurrencyIcon size="sm" /></p>
                        <p className="text-xs mt-1">You can transfer up to {formatCurrency(maxTransferAmount)} <CurrencyIcon size="sm" /> more from this contribution.</p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="transfer-amount">Transfer Amount</Label>
                        <span className="text-sm text-gray-500">
                          Max: {formatCurrency(maxTransferAmount)} <CurrencyIcon size="sm" />
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="transfer-amount"
                          type="number"
                          value={transferAmount}
                          onChange={handleTransferAmountChange}
                          min="0"
                          max={maxTransferAmount}
                          step="0.01"
                          disabled={isLoading || maxTransferAmount <= 0}
                        />
                        <span className="text-sm font-medium flex items-center">
                          <CurrencyIcon size="sm" />
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Total amount transferred:</span>
                        <span className="flex items-center">
                          {formatCurrency(alreadyTransferred + parseFloat(transferAmount || '0'))} <CurrencyIcon size="sm" className="ml-1" />
                        </span>
                      </div>
                      <Progress 
                        value={
                          selectedContribution ? 
                          ((alreadyTransferred + parseFloat(transferAmount || '0')) / (selectedContribution.amount * 0.9)) * 100 : 
                          0
                        } 
                      />
                      {selectedContribution && (alreadyTransferred + parseFloat(transferAmount || '0') > selectedContribution.amount * 0.9) && (
                        <p className="text-xs text-red-500 mt-1">
                          You can only transfer up to 90% ({formatCurrency(selectedContribution.amount * 0.9)} <CurrencyIcon size="sm" />) in total from the original contribution
                        </p>
                      )}
                      {maxTransferAmount <= 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          You have already transferred the maximum allowed amount from this contribution
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <Button 
                    onClick={handleTransferRequest}
                    disabled={
                      isLoading || 
                      !selectedContribution || 
                      parseFloat(transferAmount) <= 0 ||
                      maxTransferAmount <= 0 ||
                      alreadyTransferred + parseFloat(transferAmount) > selectedContribution?.amount * 0.9
                    }
                    className="w-full"
                  >
                    {isLoading ? 'Processing...' : 'Transfer Bounty'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bounty Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to transfer {formatCurrency(parseFloat(transferAmount))} <CurrencyIcon size="sm" /> from 
              {selectedContribution?.scammers?.name ? ` ${selectedContribution.scammers.name}` : ' the original scammer'} to {scammerName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Confirm Transfer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Dialog>
    </>
  );
};

export default BountyTransferDialog;
