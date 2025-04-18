import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { formatCurrency } from '@/utils/formatCurrency';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Scammer {
  id: string;
  name: string;
  bounty_amount: number;
  views: number;
}

const fetchScammer = async (id: string): Promise<Scammer | null> => {
  const { data, error } = await supabase
    .from('scammers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching scammer:', error);
    return null;
  }

  return data;
};

const ScammerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scammer, isLoading, error } = useQuery({
    queryKey: ['scammer', id],
    queryFn: () => fetchScammer(id!),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading scammer details...</div>;
  if (error) return <div>Error loading scammer details</div>;
  if (!scammer) return <div>Scammer not found</div>;

  const totalBounty = scammer?.bounty_amount || 0;

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bounty</CardTitle>
            <CurrencyIcon size="md" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBounty)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scammer Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scammer.name}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scammer.views}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScammerDetailPage;
