
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign } from 'lucide-react';
import { UseMutationResult } from '@tanstack/react-query';
import { Profile } from '@/types/dataTypes';
import CurrencyIcon from '@/components/common/CurrencyIcon';

interface ContributionFormProps {
  contributionAmount: string;
  setContributionAmount: (value: string) => void;
  bountyComment: string;
  setBountyComment: (value: string) => void;
  isProcessing: boolean;
  addBountyContributionMutation: UseMutationResult<any, unknown, any, unknown>;
  handleAddBounty: () => void;
  profile: Profile | null;
}

const ContributionForm = ({ 
  contributionAmount, 
  setContributionAmount, 
  bountyComment, 
  setBountyComment,
  isProcessing,
  addBountyContributionMutation,
  handleAddBounty,
  profile
}: ContributionFormProps) => {
  return (
    <>
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
          <span id="contribution-amount-currency" className="text-icc-gold-dark font-medium flex items-center">
            <CurrencyIcon />
          </span>
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
            <CurrencyIcon className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </span>
        ) : profile ? (
          "Contribute to Bounty"
        ) : (
          "Connect your wallet to contribute"
        )}
      </Button>
    </>
  );
};

export default ContributionForm;
