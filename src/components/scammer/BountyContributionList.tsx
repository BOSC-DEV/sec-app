
import React, { useState } from 'react';
import { BountyContribution } from '@/types/dataTypes';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Calendar, ArrowLeftIcon, ArrowRightIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';

interface BountyContributionListProps {
  contributions: BountyContribution[];
  isLoading: boolean;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  itemsPerPage?: number;
}

const BountyContributionList: React.FC<BountyContributionListProps> = ({
  contributions,
  isLoading,
  totalCount = 0,
  onPageChange,
  currentPage = 1,
  itemsPerPage = 10
}) => {
  const [focused, setFocused] = useState<string | null>(null);
  
  // Calculate pagination info
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && onPageChange) {
      onPageChange(newPage);
    }
  };

  const openTransactionInSolscan = (transactionSignature: string) => {
    if (!transactionSignature) return;
    window.open(`https://solscan.io/tx/${transactionSignature}`, '_blank');
  };

  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className="text-center py-4">
        <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        <span className="sr-only">Loading bounty contributions...</span>
      </div>
    );
  }

  if (!contributions || contributions.length === 0) {
    return (
      <div role="status" aria-live="polite" className="text-center py-4 text-icc-gray">
        <p>No contributions yet. Be the first to add to this bounty!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-icc-blue" id="contributions-heading">Recent Contributors</h4>
      
      <div aria-labelledby="contributions-heading" className="space-y-3">
        {contributions.map((contribution) => (
          <div 
            key={contribution.id} 
            className={`border border-icc-gold-light/30 rounded-lg p-3 bg-icc-gold-light/10 transition ${focused === contribution.id ? 'ring-2 ring-icc-gold' : ''}`}
            onFocus={() => setFocused(contribution.id)}
            onBlur={() => setFocused(null)}
            tabIndex={0}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Link to={`/profile/${contribution.contributor_username || contribution.contributor_id}`} aria-label={`View ${contribution.contributor_name}'s profile`}>
                  <Avatar className="h-6 w-6 cursor-pointer hover:ring-2 hover:ring-icc-gold transition-all">
                    <AvatarImage 
                      src={contribution.contributor_profile_pic || '/placeholder.svg'} 
                      alt={`${contribution.contributor_name}'s profile`} 
                    />
                    <AvatarFallback aria-hidden="true">
                      {contribution.contributor_name?.substring(0, 2).toUpperCase() || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link 
                  to={`/profile/${contribution.contributor_username || contribution.contributor_id}`}
                  className="text-sm font-medium text-icc-blue-dark hover:text-icc-gold hover:underline transition-colors"
                  aria-label={`View ${contribution.contributor_name}'s profile`}
                >
                  {contribution.contributor_name}
                </Link>
              </div>
              <div className="flex items-center text-icc-gold-dark font-medium text-sm" aria-label={`Contributed ${formatCurrency(contribution.amount)} $SEC`}>
                <DollarSign className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>{formatCurrency(contribution.amount)} $SEC</span>
              </div>
            </div>
            
            {contribution.comment && (
              <p className="text-sm text-icc-gray-dark mb-2 italic">
                "{contribution.comment}"
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-icc-gray flex items-center" aria-label={`Contributed on ${formatDate(contribution.created_at)}`}>
                <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                <span>{formatDate(contribution.created_at)}</span>
              </div>
              
              {contribution.transaction_signature && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => openTransactionInSolscan(contribution.transaction_signature!)}
                        className="text-xs text-icc-blue flex items-center hover:underline"
                        aria-label="View transaction on Solscan"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" aria-hidden="true" />
                        View on Solscan
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View transaction details on Solscan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination controls - only show if pagination is in use */}
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-between items-center pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            aria-label="Previous page"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            Prev
          </Button>
          
          <span className="text-sm text-icc-gray" aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            aria-label="Next page"
          >
            Next
            <ArrowRightIcon className="h-4 w-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BountyContributionList;
