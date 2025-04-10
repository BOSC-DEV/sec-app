
import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBountyContribution } from '@/services/bountyService';
import { sendTransactionToDevWallet } from '@/utils/phantomWallet';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';
import { Separator } from '@/components/ui/separator';
import DeveloperWalletDisplay from './DeveloperWalletDisplay';
import ContributionForm from './ContributionForm';
import BountyTransferDialog from './BountyTransferDialog';

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
      // Ensure the wallet address is valid
      if (!developerWalletAddress || developerWalletAddress.trim() === '') {
        toast({
          title: "Invalid wallet address",
          description: "Developer wallet address is not specified.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
      // Log address for debugging
      console.log(`Processing bounty transaction of ${amount} $SEC to ${developerWalletAddress}`);
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
  
  const handleTransferComplete = () => {
    // Refresh both queries to show updated data
    queryClient.invalidateQueries({
      queryKey: ['bountyContributions', scammerId]
    });
    queryClient.invalidateQueries({
      queryKey: ['scammer', scammerId]
    });
  };

  return (
    <div id="bounty-section" className="bg-icc-gold-light/20 border border-icc-gold rounded-lg p-5 mt-4">
      <h4 className="font-bold text-xl text-icc-blue mb-2">Contribute to Bounty</h4>
      <p className="text-sm text-icc-gray-dark mb-4">
        Add $SEC tokens to increase the bounty for {scammerName}
      </p>
      
      <DeveloperWalletDisplay developerWalletAddress={developerWalletAddress} />
      
      <ContributionForm 
        contributionAmount={contributionAmount}
        setContributionAmount={setContributionAmount}
        bountyComment={bountyComment}
        setBountyComment={setBountyComment}
        isProcessing={isProcessing}
        addBountyContributionMutation={addBountyContributionMutation}
        handleAddBounty={handleAddBounty}
        profile={profile}
      />
      
      {profile && (
        <>
          <Separator className="my-4" />
          <div className="text-center text-sm text-icc-gray mb-3">
            Or transfer from an existing contribution
          </div>
          
          <BountyTransferDialog 
            scammerId={scammerId}
            scammerName={scammerName}
            onTransferComplete={handleTransferComplete}
          />
        </>
      )}
    </div>
  );
};

export default BountyForm;
