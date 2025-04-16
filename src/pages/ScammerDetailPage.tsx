
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Scammer } from '@/types/dataTypes';
import * as scammerService from '@/services/scammerService';

const ScammerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch scammer data
  const { data: scammer, isLoading, error } = useQuery({
    queryKey: ['scammer', id],
    queryFn: () => scammerService.getScammerById(id as string),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading scammer details</div>;
  if (!scammer) return <div>Scammer not found</div>;

  return (
    <div>
      {/* Find the accusation section and update its text color */}
      <div className="mt-4 mb-6">
        <h2 className="icc-title">{scammer.name}'s Accusations</h2>
        <p className="text-lg text-icc-gray-dark dark:text-white mt-2">{scammer.accused_of}</p>
      </div>
    </div>
  );
};

// Export as default so it can be imported properly in App.tsx
export default ScammerDetailPage;
