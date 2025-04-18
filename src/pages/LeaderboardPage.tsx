import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfileStatistics } from '@/services/statisticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import CurrencyIcon from '@/components/common/CurrencyIcon';

interface ProfileStatistics {
  wallet_address: string;
  username: string;
  avatar_url: string;
  reports_count: number;
  likes_count: number;
  views_count: number;
  comments_count: number;
  bounty_amount: number;
  bounties_raised: number;
}

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<ProfileStatistics[]>([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ['profileStatistics'],
    queryFn: getProfileStatistics,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      // Sort the data by a combined score (e.g., reports + likes + views + comments + bounty)
      const sortedData = [...data].sort((a, b) =>
        (b.reports_count + b.likes_count + b.views_count + b.comments_count + b.bounty_amount + b.bounties_raised) -
        (a.reports_count + a.likes_count + a.views_count + a.comments_count + a.bounty_amount + a.bounties_raised)
      );
      setLeaderboardData(sortedData);
    }
  }, [data]);

  const totalBounties = leaderboardData.reduce((sum, profile) => sum + profile.bounty_amount, 0);

  if (isLoading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error loading leaderboard</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
            <CurrencyIcon size="md" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBounties)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reporters</CardTitle>
            {/* You might want to use a different icon here, like a user icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboardData.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            {/* You might want to use a different icon here, like a comment icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(leaderboardData.reduce((sum, profile) => sum + profile.comments_count, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Top Reporters</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] w-full">
            <div className="relative">
              <table className="w-full text-sm">
                <thead className="[&_th]:px-4 [&_th]:py-2 [&_th:first-child]:pl-6 [&_th:last-child]:pr-6">
                  <tr>
                    <th className="text-left font-medium">Rank</th>
                    <th className="text-left font-medium">User</th>
                    <th className="text-right font-medium">Reports</th>
                    <th className="text-right font-medium">Likes</th>
                    <th className="text-right font-medium">Views</th>
                    <th className="text-right font-medium">Comments</th>
                    <th className="text-right font-medium">Bounty Contributed</th>
                    <th className="text-right font-medium">Bounties Raised</th>
                  </tr>
                </thead>
                <tbody className="[&_td]:p-4 [&_tr:not(:last-child)]:border-b">
                  {leaderboardData.map((profile, index) => (
                    <tr key={profile.wallet_address}>
                      <td className="font-medium pl-6">{index + 1}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={profile.avatar_url} alt={profile.username} />
                            <AvatarFallback>{profile.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{profile.username}</span>
                        </div>
                      </td>
                      <td className="text-right">{formatNumber(profile.reports_count)}</td>
                      <td className="text-right">{formatNumber(profile.likes_count)}</td>
                      <td className="text-right">{formatNumber(profile.views_count)}</td>
                      <td className="text-right">{formatNumber(profile.comments_count)}</td>
                      <td className="text-right">{formatCurrency(profile.bounty_amount)}</td>
                      <td className="text-right">{formatCurrency(profile.bounties_raised)}</td>
                    </tr>
                  ))}
                  {leaderboardData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
