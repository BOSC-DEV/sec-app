
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Clipboard, DollarSign, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { addBountyContribution } from '@/services/bountyService';
import { sendTransactionToDevWallet, connectPhantomWallet } from '@/utils/phantomWallet';
import { handleError, ErrorSeverity, retryWithBackoff } from '@/utils/errorHandling';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BountyFormProps {
  scammerId: string;
  scammerName: string;
  developerWalletAddress: string;
}

const BountyForm: React.FC<BountyFormProps> = ({ 
  scammerId, 
  scammerName, 
  developerWalletAddress 
}) => {
  const { profile, connectWallet } = useProfile();
  const queryClient = useQueryClient();
  const [contributionAmount, setContributionAmount] = useState('0.00');
  const [bountyComment, setBountyComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const developerWallet = developerWalletAddress ? 
    `${developerWalletAddress.substring(0, 4)}...${developerWalletAddress.substring(developerWalletAddress.length - 4)}` : 
    'Not specified';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Developer wallet address copied!"
      });
    }).catch((error) => {
      handleError(error, {
        fallbackMessage: "Failed to copy to clipboard",
        severity: ErrorSeverity.LOW,
        context: "COPY_WALLET"
      });
    });
  };

  const addBountyContributionMutation = useMutation({
    mutationFn: (contribution: {
      scammer_id: string;
      amount: number;
      comment?: string;
      contributor_id: string;
      contributor_name: string;
      contributor_profile_pic?: string;
      transaction_signature?: string;
    }) => addBountyContribution(contribution),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bountyContributions', scammerId]
      });
      queryClient.invalidateQueries({
        queryKey: ['scammer', scammerId]
      });
      setContributionAmount('0.00');
      setBountyComment('');
      toast({
        title: "Bounty contribution",
        description: `Thank you for contributing to this bounty!`
      });
    },
    onError: error => {
      handleError(error, {
        fallbackMessage: "Failed to contribute to the bounty. Please try again.",
        severity: ErrorSeverity.MEDIUM,
        context: "ADD_BOUNTY"
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  const handleAddBounty = async () => {
    // Check if user is logged in
    if (!profile) {
      // Try to connect wallet first
      await connectWallet();
      if (!profile) {
        toast({
          title: "Authentication required",
          description: "Please connect your wallet to contribute to this bounty.",
          variant: "destructive"
        });
        return;
      }
    }
    
    const amount = parseFloat(contributionAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid contribution amount.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Process the transaction to the developer wallet
      console.log(`Processing bounty transaction of ${amount} $SEC to ${developerWalletAddress}`);
      
      // Add a more detailed log before the transaction
      console.log('Developer wallet address type and value:', {
        address: developerWalletAddress,
        type: typeof developerWalletAddress,
        length: developerWalletAddress.length
      });
      
      const transactionSignature = await sendTransactionToDevWallet(developerWalletAddress, amount);
      
      if (!transactionSignature) {
        setIsProcessing(false);
        return;
      }
      
      // Only proceed with database operation if transaction was successful
      console.log("Recording bounty contribution in database");
      addBountyContributionMutation.mutate({
        scammer_id: scammerId,
        amount: amount,
        comment: bountyComment || undefined,
        contributor_id: profile.wallet_address,
        contributor_name: profile.display_name,
        contributor_profile_pic: profile.profile_pic_url,
        transaction_signature: transactionSignature
      });
    } catch (error) {
      console.error("Bounty contribution error:", error);
      handleError(error, {
        fallbackMessage: "Failed to process bounty contribution. Please try again.",
        severity: ErrorSeverity.MEDIUM,
        context: "PROCESS_BOUNTY"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div id="bounty-section" className="bg-icc-gold-light/20 border border-icc-gold rounded-lg p-5 mt-4">
      <h4 className="font-bold text-xl text-icc-blue mb-2">Contribute to Bounty</h4>
      <p className="text-sm text-icc-gray-dark mb-4">
        Add $SEC tokens to increase the bounty for {scammerName}
      </p>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-icc-blue mb-2">Developer Wallet</div>
        <div className="bg-icc-gold-light/30 border border-icc-gold/30 rounded p-3 flex items-center justify-between">
          <span className="font-mono text-sm text-icc-blue-dark">{developerWallet}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-icc-gold-dark hover:text-icc-blue hover:bg-icc-gold-light/50" 
            onClick={() => copyToClipboard(developerWalletAddress)}
            aria-label="Copy developer wallet address"
          >
            <Clipboard className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-icc-blue mb-2" id="contribution-amount-label">Contribution Amount</div>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={contributionAmount}
            onChange={e => setContributionAmount(e.target.value)}
            className="bg-icc-gold-light/30 border-icc-gold/30 text-icc-blue-dark"
            min="0"
            step="0.01"
            aria-labelledby="contribution-amount-label"
            aria-describedby="contribution-amount-currency"
          />
          <span id="contribution-amount-currency" className="text-icc-gold-dark font-medium">$SEC</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-icc-blue mb-2" id="contribution-comment-label">Add a Comment (Optional)</div>
        <Textarea
          value={bountyComment}
          onChange={e => setBountyComment(e.target.value)}
          placeholder="Why are you contributing to this bounty?"
          className="bg-icc-gold-light/30 border-icc-gold/30 text-icc-blue-dark"
          aria-labelledby="contribution-comment-label"
        />
      </div>
      
      <Button 
        className="w-full bg-icc-gold hover:bg-icc-gold-dark text-icc-blue-dark border-icc-gold-dark font-medium"
        onClick={handleAddBounty}
        disabled={isProcessing || addBountyContributionMutation.isPending}
        aria-label="Contribute to bounty"
      >
        {isProcessing || addBountyContributionMutation.isPending ? (
          <span className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </span>
        ) : profile ? (
          "Contribute to Bounty"
        ) : (
          "Connect your wallet to contribute"
        )}
      </Button>
    </div>
  );
};

export default BountyForm;
