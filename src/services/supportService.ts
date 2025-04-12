
import { supabase } from '@/integrations/supabase/client';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';

// Types for our new features
export interface SupportTicket {
  id?: string;
  user_id: string;
  subject: string;
  description: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  resolution_notes?: string;
}

export interface KeyUpdate {
  id?: string;
  title: string;
  description: string;
  category: 'platform' | 'security' | 'feature' | 'community';
  importance?: 'low' | 'normal' | 'high' | 'critical';
  created_at?: string;
  expires_at?: string;
  is_pinned?: boolean;
}

export const createSupportTicket = async (ticket: SupportTicket): Promise<SupportTicket | null> => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert(ticket)
      .select()
      .single();

    if (error) throw error;
    return data as SupportTicket;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to create support ticket',
      severity: ErrorSeverity.MEDIUM,
      context: 'CREATE_SUPPORT_TICKET'
    });
    return null;
  }
};

export const getKeyUpdates = async (): Promise<KeyUpdate[]> => {
  try {
    const { data, error } = await supabase
      .from('key_updates')
      .select('*')
      .order('created_at', { ascending: false })
      .gt('expires_at', new Date().toISOString());

    if (error) throw error;
    return data as KeyUpdate[] || [];
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to fetch key updates',
      severity: ErrorSeverity.LOW,
      context: 'GET_KEY_UPDATES'
    });
    return [];
  }
};
