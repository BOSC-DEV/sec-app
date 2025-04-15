
import { supabase } from '@/integrations/supabase/client';
import type { Scammer } from '@/types/dataTypes';

export const searchScammers = async (searchTerm: string): Promise<Scammer[]> => {
  if (!searchTerm || searchTerm.length < 2) return [];

  try {
    // Search in both name and aliases
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .or(`name.ilike.%${searchTerm}%, aliases.cs.{${searchTerm}}`)
      .is('deleted_at', null)
      .limit(5);

    if (error) {
      console.error('Error searching scammers:', error);
      return [];
    }

    // Ensure we always return an array, even if data is null or undefined
    return data || [];
  } catch (error) {
    console.error('Exception searching scammers:', error);
    return [];
  }
};
