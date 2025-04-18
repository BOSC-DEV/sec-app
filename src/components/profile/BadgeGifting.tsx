
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Gift } from 'lucide-react';
import { giftBadge } from '@/services/badgeService';
import { BadgeInfo } from '@/utils/badgeUtils';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleGiftBadge = async () => {
    if (!recipientWallet.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipient wallet address",
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
          <div className="flex gap-2">
            <Input
              placeholder="Enter recipient wallet address"
              value={recipientWallet}
              onChange={(e) => setRecipientWallet(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleGiftBadge} 
              disabled={isLoading || remainingDelegations === 0}
            >
              {isLoading ? "Gifting..." : "Gift Badge"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeGifting;
