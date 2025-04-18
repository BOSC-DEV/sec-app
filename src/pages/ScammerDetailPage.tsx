import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { formatCurrency } from '@/lib/utils';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ScammerDetails {
  id: string;
  name: string;
  views: number;
  bounty_amount: number;
  total_bounty: number;
  contributions: Contribution[];
}

interface Contribution {
  id: string;
  amount: number;
  created_at: string;
  username: string;
}

const fetchScammerDetails = async (scammerId: string | undefined): Promise<ScammerDetails> => {
  if (!scammerId) {
    throw new Error('Scammer ID is required');
  }

  const { data: scammerData, error: scammerError } = await supabase
    .from('scammers')
    .select('id, name, views, bounty_amount')
    .eq('id', scammerId)
    .single();

  if (scammerError) {
    console.error('Error fetching scammer details:', scammerError);
    throw new Error('Failed to fetch scammer details');
  }

  const { data: contributionsData, error: contributionsError } = await supabase
    .from('bounty_contributions')
    .select('id, amount, created_at, profiles(username)')
    .eq('scammer_id', scammerId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (contributionsError) {
    console.error('Error fetching bounty contributions:', contributionsError);
    throw new Error('Failed to fetch bounty contributions');
  }

  const contributions = contributionsData
    ? contributionsData.map(contribution => ({
        id: contribution.id,
        amount: contribution.amount,
        created_at: contribution.created_at,
        username: (contribution.profiles as any)?.username || 'Anonymous'
      }))
    : [];

  const total_bounty = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);

  return {
    id: scammerData.id,
    name: scammerData.name,
    views: scammerData.views || 0,
    bounty_amount: scammerData.bounty_amount || 0,
    total_bounty: total_bounty,
    contributions: contributions
  };
};

const ScammerDetailPage: React.FC = () => {
  const { id: scammerId } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['scammerDetails', scammerId],
    queryFn: () => fetchScammerDetails(scammerId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div>Loading scammer details...</div>;
  if (error) return <div>Error loading scammer details</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bounty Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Bounty</span>
                <div className="flex items-center gap-2">
                  <CurrencyIcon size="sm" />
                  {formatCurrency(data?.total_bounty || 0)}
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contribution History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contributor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.contributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell>{contribution.username}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <CurrencyIcon size="sm" />
                      {formatCurrency(contribution.amount)}
                    </TableCell>
                    <TableCell>{new Date(contribution.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScammerDetailPage;
