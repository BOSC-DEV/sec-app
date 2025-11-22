
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UseMutationResult } from '@tanstack/react-query';
import { Profile } from '@/types/dataTypes';
import CurrencyIcon from '@/components/common/CurrencyIcon';

interface ContributionFormProps {
  contributionAmount: string;
  setContributionAmount: (value: string) => void;
  bountyComment: string;
  setBountyComment: (value: string) => void;
  isProcessing: boolean;
  addBountyContributionMutation?: UseMutationResult<any, unknown, any, unknown>;
  handleAddBounty: () => void;
  profile: Profile | null;
  buttonText?: string;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  contributionAmount,
  setContributionAmount,
  bountyComment,
  setBountyComment,
  isProcessing,
  addBountyContributionMutation,
  handleAddBounty,
  profile,
  buttonText = "Contribute to Bounty"
}) => {
  const userBalance = profile?.sec_balance || 0;
  const contributionValue = parseFloat(contributionAmount) || 0;
  const hasInsufficientFunds = contributionValue > userBalance;

  return (
    <div className="dark:text-white text-table">
      {profile && (
        <div className="mb-3 p-2 bg-background/50 rounded-md border border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your balance:</span>
            <span className="font-medium flex items-center gap-1">
              {userBalance.toFixed(2)} <CurrencyIcon />
            </span>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <div id="contribution-amount-label" className="text-sm font-medium text-icc-blue dark:text-white my-[5px]">Contribution Amount</div>
        <div className="flex items-center space-x-2">
          <Input 
            type="number" 
            value={contributionAmount} 
            onChange={e => setContributionAmount(e.target.value)} 
            className={`bg-icc-gold-light/30 border-icc-gold/30 text-icc-blue-dark dark:text-white ${hasInsufficientFunds && contributionValue > 0 ? 'border-red-500' : ''}`}
            min="0" 
            step="0.01" 
            aria-labelledby="contribution-amount-label" 
            aria-describedby="contribution-amount-currency" 
          />
          <span id="contribution-amount-currency" className="text-icc-gold-dark dark:text-white font-medium flex items-center">
            <CurrencyIcon />
          </span>
        </div>
        {hasInsufficientFunds && contributionValue > 0 && (
          <p className="text-red-500 text-xs mt-1">
            Insufficient funds. You need {contributionValue.toFixed(2)} SEC but only have {userBalance.toFixed(2)} SEC.
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <div id="contribution-comment-label" className="text-sm font-medium text-icc-blue dark:text-white my-[5px]">Add a Comment (Optional)</div>
        <Textarea 
          value={bountyComment} 
          onChange={e => setBountyComment(e.target.value)} 
          placeholder="Why are you contributing to this bounty?" 
          className="bg-icc-gold-light/30 border-icc-gold/30 text-icc-blue-dark dark:text-white" 
          aria-labelledby="contribution-comment-label" 
        />
      </div>
      
      <Button 
        className="w-full bg-icc-gold hover:bg-icc-gold-dark text-icc-blue-dark dark:text-white border-icc-gold-dark font-medium" 
        onClick={handleAddBounty} 
        disabled={isProcessing || (addBountyContributionMutation && addBountyContributionMutation.isPending) || hasInsufficientFunds} 
        aria-label="Contribute to bounty"
      >
        {isProcessing || (addBountyContributionMutation && addBountyContributionMutation.isPending) ? (
          <span className="flex items-center">
            <div className="h-4 w-4 mr-2 animate-spin">
              <CurrencyIcon />
            </div>
            Processing...
          </span>
        ) : profile ? buttonText : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default ContributionForm;
