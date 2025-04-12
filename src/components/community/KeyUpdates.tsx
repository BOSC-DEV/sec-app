
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getKeyUpdates, KeyUpdate } from '@/services/supportService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Shield, Star, Layers } from 'lucide-react';

const categoryIcons = {
  platform: <Layers className="h-4 w-4 mr-2 text-blue-500" />,
  security: <Shield className="h-4 w-4 mr-2 text-red-500" />,
  feature: <Star className="h-4 w-4 mr-2 text-green-500" />,
  community: <AlertCircle className="h-4 w-4 mr-2 text-purple-500" />
};

const KeyUpdatesComponent = () => {
  const { data: updates, isLoading } = useQuery({
    queryKey: ['keyUpdates'],
    queryFn: getKeyUpdates,
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {updates && updates.length > 0 ? (
        updates.map((update) => (
          <Card 
            key={update.id} 
            className={`
              ${update.is_pinned ? 'border-2 border-primary' : ''}
              hover:shadow-md transition-shadow
            `}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                {categoryIcons[update.category]}
                {update.title}
              </CardTitle>
              <Badge 
                variant={
                  update.importance === 'critical' ? 'destructive' :
                  update.importance === 'high' ? 'secondary' :
                  'outline'
                }
              >
                {update.importance}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {update.description}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-center">No Updates</h3>
            <p className="text-muted-foreground text-center mt-1">
              No key updates at the moment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeyUpdatesComponent;
