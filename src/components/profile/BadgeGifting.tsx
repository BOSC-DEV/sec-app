
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Gift } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BadgeTier } from '@/utils/badgeUtils';
import { calculateBadgeTier } from '@/utils/badgeUtils';

interface User {
  username: string;
  display_name: string;
  profile_pic_url?: string;
  sec_balance?: number;
}

const giftLimits = {
  [BadgeTier.Shrimp]: 1,
  [BadgeTier.Frog]: 2,
  [BadgeTier.Bull]: 3,
  [BadgeTier.Lion]: 4,
  [BadgeTier["King Cobra"]]: 5,
  [BadgeTier["Bull Shark"]]: 6,
  [BadgeTier["Bald Eagle"]]: 7,
  [BadgeTier["Great Ape"]]: 8,
  [BadgeTier["T-Rex"]]: 9,
  [BadgeTier.Goat]: 10,
  [BadgeTier.Whale]: 11,
};

const BadgeGifting: React.FC<{ userSecBalance?: number }> = ({ userSecBalance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const currentBadgeInfo = calculateBadgeTier(userSecBalance || 0);
  const giftLimit = currentBadgeInfo ? giftLimits[currentBadgeInfo.tier] : 0;

  const handleSearch = async (value: string) => {
    // Simulated search results for users with no badges
    if (value.length >= 3) {
      // This would be replaced with actual API call
      const mockResults: User[] = [
        {
          username: 'newuser1',
          display_name: 'New User 1',
          profile_pic_url: '',
          sec_balance: 0
        },
        {
          username: 'newuser2',
          display_name: 'New User 2',
          profile_pic_url: '',
          sec_balance: 0
        }
      ];
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleGiftClick = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Gift Badges
        </CardTitle>
        <CardDescription>
          You can gift up to {giftLimit} badges with your current tier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users without badges..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.profile_pic_url} />
                    <AvatarFallback>{getInitials(user.display_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.display_name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGiftClick(user)}
                >
                  Gift Badge
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon!</DialogTitle>
            <DialogDescription>
              Badge gifting functionality will be available soon. Stay tuned!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BadgeGifting;
