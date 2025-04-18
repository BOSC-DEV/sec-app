
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Gift } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BadgeTier } from '@/utils/badgeUtils';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoading, setIsLoading] = useState(false);

  const currentBadgeInfo = calculateBadgeTier(userSecBalance || 0);
  const giftLimit = currentBadgeInfo ? giftLimits[currentBadgeInfo.tier] : 0;

  const handleSearch = async (value: string) => {
    if (value.length >= 3) {
      setIsLoading(true);
      try {
        // Search for users with zero SEC balance (unbadged users)
        const { data, error } = await supabase
          .from('profiles')
          .select('username, display_name, profile_pic_url, sec_balance')
          .eq('sec_balance', 0)
          .ilike('display_name', `%${value}%`)
          .limit(5);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
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
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Gift Badges
        </CardTitle>
        <CardDescription>
          You can gift up to {giftLimit} badges with your current tier
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
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

          {isLoading && (
            <div className="text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

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
