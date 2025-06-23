
import { supabase } from '@/integrations/supabase/client';

export const validateUserAuthentication = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Authentication error:', error);
      return null;
    }
    
    return user?.id || null;
  } catch (error) {
    console.error('Error validating authentication:', error);
    return null;
  }
};

export const validateUserOwnership = async (
  table: string,
  recordId: string,
  userIdField: string = 'author'
): Promise<boolean> => {
  try {
    const userId = await validateUserAuthentication();
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from(table)
      .select(userIdField)
      .eq('id', recordId)
      .single();
    
    if (error) {
      console.error('Error validating ownership:', error);
      return false;
    }
    
    return data?.[userIdField] === userId;
  } catch (error) {
    console.error('Error in ownership validation:', error);
    return false;
  }
};

export const requireAuthentication = async (): Promise<string> => {
  const userId = await validateUserAuthentication();
  if (!userId) {
    throw new Error('Authentication required');
  }
  return userId;
};
