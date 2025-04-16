
import { supabase } from '@/integrations/supabase/client';
import type { Scammer } from '@/types/dataTypes';

export const searchScammers = async (searchTerm: string): Promise<Scammer[]> => {
  if (!searchTerm || searchTerm.length < 2) return [];

  try {
    // Search in name, aliases and wallet addresses
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .or(`name.ilike.%${searchTerm}%, aliases.cs.{${searchTerm}}, wallet_addresses.cs.{${searchTerm}}`)
      .is('deleted_at', null)
      .limit(5);

    if (error) {
      console.error('Error searching scammers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception searching scammers:', error);
    return [];
  }
};
