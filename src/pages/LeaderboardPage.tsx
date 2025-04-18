import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/utils/formatCurrency';

interface LeaderboardUser {
  username: string;
  total_bounties: number;
  reported_scammers: number;
  tier: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
}

const fetchLeaderboardData = async (): Promise<LeaderboardData> => {
  // Mock data for now
  return {
    leaderboard: [
      { username: 'user1', total_bounties: 1000, reported_scammers: 10, tier: 'Gold' },
      { username: 'user2', total_bounties: 500, reported_scammers: 5, tier: 'Silver' },
      { username: 'user3', total_bounties: 250, reported_scammers: 2, tier: 'Bronze' },
    ],
  };
};

const LeaderboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboardData'],
    queryFn: fetchLeaderboardData,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error loading leaderboard</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Total Bounties</TableHead>
            <TableHead>Reported Scammers</TableHead>
            <TableHead>Tier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.leaderboard.map((user, index) => (
            <TableRow key={user.username}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell className="flex items-center gap-2">
                <CurrencyIcon size="sm" />
                {formatCurrency(user.total_bounties)}
              </TableCell>
              <TableCell>{user.reported_scammers}</TableCell>
              <TableCell>
                <Badge variant="tier">{user.tier}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardPage;
