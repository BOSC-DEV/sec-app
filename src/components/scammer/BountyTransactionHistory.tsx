import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BountyContribution } from '@/types/dataTypes';
import { formatDistanceToNow, format } from 'date-fns';
import { DollarSign, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';
import { getProfileByDisplayName } from '@/services/profileService';
import CurrencyIcon from '@/components/common/CurrencyIcon';

interface BountyTransactionHistoryProps {
  contributions: BountyContribution[];
  isLoading?: boolean;
  title?: string;
  showScammerInfo?: boolean;
}

const BountyTransactionHistory: React.FC<BountyTransactionHistoryProps> = ({
  contributions,
  isLoading = false,
  title = "Bounty Transaction History",
  showScammerInfo = false
}) => {
  const [contributorUsernames, setContributorUsernames] = useState<Record<string, string>>({});
  
  const renderTimestamp = React.useMemo(() => Date.now(), [contributions]);
  
  useEffect(() => {
    const fetchContributorUsernames = async () => {
      const usernamesMap: Record<string, string> = {};
      
      await Promise.all(
        contributions.map(async (contribution) => {
          try {
            const profile = await getProfileByDisplayName(contribution.contributor_name);
            if (profile && profile.username) {
              usernamesMap[contribution.contributor_name] = profile.username;
            } else {
              usernamesMap[contribution.contributor_name] = contribution.contributor_name;
            }
          } catch (error) {
            console.error(`Error fetching profile for ${contribution.contributor_name}:`, error);
            usernamesMap[contribution.contributor_name] = contribution.contributor_name;
          }
        })
      );
      
      setContributorUsernames(usernamesMap);
    };

    if (contributions.length > 0) {
      fetchContributorUsernames();
    }
  }, [contributions]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const openExplorer = (txSignature: string) => {
    window.open(`https://solscan.io/tx/${txSignature}`, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading transaction history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <DollarSign className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No transactions found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No bounty contributions have been made yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Recent bounty contributions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contributor</TableHead>
              {showScammerInfo && <TableHead>Target</TableHead>}
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((contribution) => {
              const stableKey = `transaction-${contribution.id}`;
              
              const profilePicUrl = contribution.contributor_profile_pic 
                ? `${contribution.contributor_profile_pic}${contribution.contributor_profile_pic.includes('?') ? '&' : '?'}t=${renderTimestamp}`
                : '/placeholder.svg';
                
              const profileLink = contributorUsernames[contribution.contributor_name] 
                ? `/profile/${contributorUsernames[contribution.contributor_name]}` 
                : `/profile/${contribution.contributor_name}`;
                
              return (
                <TableRow key={stableKey}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={profileLink} aria-label={`View ${contribution.contributor_name}'s profile`}>
                        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-icc-gold transition-all">
                          <AvatarImage 
                            src={profilePicUrl} 
                            alt={contribution.contributor_name} 
                          />
                          <AvatarFallback>
                            {contribution.contributor_name?.substring(0, 2).toUpperCase() || 'UN'}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div>
                        <Link 
                          to={profileLink}
                          className="text-sm font-medium hover:text-icc-gold hover:underline transition-colors"
                          aria-label={`View ${contribution.contributor_name}'s profile`}
                        >
                          {contribution.contributor_name}
                        </Link>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                                {contribution.contributor_id}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{contribution.contributor_id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </TableCell>
                  
                  {showScammerInfo && contribution.scammers && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link to={`/scammer/${contribution.scammer_id}`} aria-label={`View ${contribution.scammers.name}'s profile`}>
                          <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-icc-gold transition-all">
                            <AvatarImage 
                              src={contribution.scammers.photo_url || '/placeholder.svg'} 
                              alt={contribution.scammers.name} 
                            />
                            <AvatarFallback>
                              {contribution.scammers.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <Link 
                          to={`/scammer/${contribution.scammer_id}`}
                          className="text-sm hover:text-icc-gold hover:underline transition-colors"
                          aria-label={`View ${contribution.scammers.name}'s profile`}
                        >
                          {contribution.scammers.name}
                        </Link>
                      </div>
                    </TableCell>
                  )}
                  
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                      {formatAmount(contribution.amount)} <CurrencyIcon size="sm" />
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(contribution.created_at), { addSuffix: true })}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{format(new Date(contribution.created_at), 'PPpp')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  
                  <TableCell>
                    {contribution.transaction_signature ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-2 h-8"
                        onClick={() => openExplorer(contribution.transaction_signature!)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Solscan
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not recorded</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BountyTransactionHistory;
