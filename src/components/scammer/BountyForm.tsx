import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBountyContribution } from '@/services/bountyService';
import { sendTransactionToDevWallet } from '@/utils/phantomWallet';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';
import DeveloperWalletDisplay from './DeveloperWalletDisplay';
import ContributionForm from './ContributionForm';
import BountyTransferDialog from './BountyTransferDialog';
import CurrencyIcon from '@/components/common/CurrencyIcon';

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
    if (!profile) {
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
      if (!developerWalletAddress || developerWalletAddress.trim() === '') {
        toast({
          title: "Invalid wallet address",
          description: "Developer wallet address is not specified.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
      console.log(`Processing bounty transaction of ${amount} SEC to ${developerWalletAddress}`);
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
    queryClient.invalidateQueries({
      queryKey: ['bountyContributions', scammerId]
    });
    queryClient.invalidateQueries({
      queryKey: ['scammer', scammerId]
    });
  };
  
  return (
    <div className="bg-gray-50 dark:bg-icc-blue-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-serif font-bold text-icc-blue dark:text-white mb-3">Add Bounty for {scammerName}</h3>
      
      <p className="text-sm text-icc-gray dark:text-gray-300 mb-4">
        Contribute to the bounty for catching this scammer. All funds go to the developer wallet to maintain this site.
      </p>
      
      <DeveloperWalletDisplay developerWalletAddress={developerWalletAddress} />
      
      <ContributionForm
        contributionAmount={contributionAmount}
        setContributionAmount={setContributionAmount}
        bountyComment={bountyComment}
        setBountyComment={setBountyComment}
        handleAddBounty={handleAddBounty}
        isProcessing={isProcessing}
        addBountyContributionMutation={addBountyContributionMutation}
        profile={profile}
        buttonText="Add Bounty"
      />

      <div className="mt-2">
        <BountyTransferDialog 
          scammerId={scammerId} 
          scammerName={scammerName}
          onTransferComplete={handleTransferComplete} 
          bountyAmount={0}
        />
      </div>
    </div>
  );
};

export default BountyForm;
