
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Gift, Search } from 'lucide-react';
import { giftBadge, searchEligibleRecipients } from '@/services/badgeService';
import { BadgeInfo } from '@/utils/badgeUtils';
import { debounce } from 'lodash';

interface Recipient {
  wallet_address: string;
  username?: string;
  display_name: string;
  profile_pic_url?: string;
}

interface BadgeGiftingProps {
  walletAddress: string;
  badgeInfo: BadgeInfo | null;
  delegationLimit: number;
  remainingDelegations: number;
}

const BadgeGifting: React.FC<BadgeGiftingProps> = ({
  walletAddress,
  badgeInfo,
  delegationLimit,
  remainingDelegations
}) => {
  const [recipientWallet, setRecipientWallet] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.trim().length > 2) {
        try {
          const results = await searchEligibleRecipients(term);
          setRecipients(results);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to search for recipients',
            variant: 'destructive'
          });
        }
      } else {
        setRecipients([]);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleSelectRecipient = (recipient: Recipient) => {
    setRecipientWallet(recipient.wallet_address);
    setSearchTerm(recipient.username || recipient.display_name);
    setRecipients([]);
  };

  const handleGiftBadge = async () => {
    if (!recipientWallet.trim()) {
      toast({
        title: "Error",
        description: "Please select a recipient",
        variant: "destructive"
      });
      return;
    }

    if (recipientWallet === walletAddress) {
      toast({
        title: "Error",
        description: "You cannot gift a badge to yourself",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { success, error } = await giftBadge(walletAddress, recipientWallet);
      
      if (success) {
        toast({
          title: "Success",
          description: "Badge gifted successfully!",
          variant: "default"
        });
        setRecipientWallet('');
        setSearchTerm('');
        // Force a refresh to update the remaining delegations
        window.location.reload();
      } else {
        throw new Error(error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!badgeInfo) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5" />
          Gift Badge
        </CardTitle>
        <CardDescription>
          You can gift your {badgeInfo.tier} badge to other users ({remainingDelegations} of {delegationLimit} gifts remaining)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Badge variant="tier" className="mb-2">
              {badgeInfo.icon} {badgeInfo.tier}
            </Badge>
          </div>
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search recipient by username or name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
              <Button 
                onClick={handleGiftBadge} 
                disabled={isLoading || remainingDelegations === 0 || !recipientWallet}
              >
                {isLoading ? "Gifting..." : "Gift Badge"}
              </Button>
            </div>
            {recipients.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded-md shadow-lg">
                {recipients.map((recipient) => (
                  <div 
                    key={recipient.wallet_address}
                    onClick={() => handleSelectRecipient(recipient)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {recipient.username || recipient.display_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeGifting;
