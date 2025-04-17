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
import { transferBountyContribution, getUserTransferableContributions } from '@/services/bountyService';
import { getScammerById } from '@/services/scammerService';
import { formatCurrency } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { Textarea } from '@/components/ui/textarea';

interface BountyTransferDialogProps {
  scammerId: string;
  scammerName?: string;
  creatorWallet?: string;
  bountyAmount: number;
  onTransferComplete?: () => void;
}

const BountyTransferDialog: React.FC<BountyTransferDialogProps> = ({
  scammerId,
  scammerName,
  creatorWallet,
  bountyAmount,
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
  const [transferComment, setTransferComment] = useState('');
  const [scammerData, setScammerData] = useState<Scammer | null>(null);

  useEffect(() => {
    const fetchScammerData = async () => {
      if (!scammerName && scammerId) {
        try {
          const data = await getScammerById(scammerId);
          setScammerData(data);
        } catch (error) {
          console.error('Error fetching scammer data:', error);
        }
      }
    };
    
    fetchScammerData();
  }, [scammerId, scammerName]);

  const effectiveScammerName = scammerName || scammerData?.name || 'this scammer';

  useEffect(() => {
    const fetchTransferableContributions = async () => {
      if (!profile?.wallet_address || !isOpen) return;
      
      setIsLoading(true);
      try {
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
    
    fetchTransferableContributions();
  }, [profile?.wallet_address, scammerId, isOpen, toast]);

  useEffect(() => {
    if (selectedContribution) {
      const max = selectedContribution.amount;
      setMaxTransferAmount(max);
      setTransferAmount(max.toFixed(2));
    } else {
      setMaxTransferAmount(0);
      setTransferAmount('0');
    }
  }, [selectedContribution]);

  const handleSelectContribution = (contributionId: string) => {
    const contribution = sourceContributions.find(c => c.id === contributionId);
    setSelectedContribution(contribution || null);
  };

  const handleTransferAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!value || isNaN(parseFloat(value))) {
      setTransferAmount('0');
      return;
    }
    
    const amount = parseFloat(value);
    
    if (amount > maxTransferAmount) {
      setTransferAmount(maxTransferAmount.toFixed(2));
      return;
    }
    
    setTransferAmount(value);
  };

  const handleTransferRequest = () => {
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
    
    if (amount > selectedContribution.amount) {
      toast({
        title: "Error",
        description: `You can only transfer up to ${selectedContribution.amount.toFixed(2)} $SEC from this contribution`,
        variant: "destructive"
      });
      return;
    }
    
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
        profile.profile_pic_url,
        transferComment
      );
      
      toast({
        title: "Success",
        description: `Successfully transferred ${transferAmount} $SEC to ${effectiveScammerName}`
      });
      
      setSelectedContribution(null);
      setTransferAmount('0');
      setTransferComment('');
      setConfirmDialogOpen(false);
      setIsOpen(false);
      
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <ArrowRightIcon className="h-4 w-4 mr-2" /> 
            Transfer from Another Bounty
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transfer Bounty to {effectiveScammerName}</DialogTitle>
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
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="transfer-amount">Transfer Amount</Label>
                        <span className="text-sm text-gray-500">
                          Available: {formatCurrency(maxTransferAmount)} <CurrencyIcon size="sm" />
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
                          disabled={isLoading}
                        />
                        <span className="text-sm font-medium flex items-center">
                          <CurrencyIcon size="sm" />
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transfer-comment">Transfer Comment (Optional)</Label>
                      <Textarea
                        id="transfer-comment"
                        value={transferComment}
                        onChange={(e) => setTransferComment(e.target.value)}
                        placeholder="Add a comment about this transfer..."
                        className="resize-none"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Remaining amount at original scammer:</span>
                        <span className="flex items-center">
                          {selectedContribution && formatCurrency(selectedContribution.amount - parseFloat(transferAmount || '0'))} <CurrencyIcon size="sm" className="ml-1" />
                        </span>
                      </div>
                      <Progress 
                        value={
                          selectedContribution ? 
                          ((selectedContribution.amount - parseFloat(transferAmount || '0')) / selectedContribution.amount) * 100 : 
                          0
                        } 
                      />
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
                      parseFloat(transferAmount) > selectedContribution?.amount
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
              {selectedContribution?.scammers?.name ? ` ${selectedContribution.scammers.name}` : ' the original scammer'} to {effectiveScammerName}?
              {transferComment && (
                <div className="mt-2">
                  <strong>Comment:</strong> {transferComment}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Confirm Transfer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BountyTransferDialog;
