import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';

interface ModerationItem {
  id: string;
  scammer_name: string;
  description: string;
  created_at: string;
  user_id: string;
  status: string;
}

export default function ModerationSection() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModerationQueue();
  }, []);

  const fetchModerationQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('report_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching moderation queue:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Moderation Queue</h1>
        <p className="text-muted-foreground">
          Content awaiting moderation review
        </p>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">Loading moderation queue...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Queue is Empty</h3>
            <p className="text-muted-foreground">
              No pending items require moderation at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4 border-l-4 border-l-yellow-500">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{item.scammer_name}</h3>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Submitted: {new Date(item.created_at).toLocaleString()}</span>
                      <span>ID: {item.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
