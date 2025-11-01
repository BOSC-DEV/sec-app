import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AdminGuardResult = {
  loading: boolean;
  isAdmin: boolean;
  profileId: string | null;
};

export function useAdminGuard(): AdminGuardResult {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          if (!cancelled) {
            setIsAdmin(false);
            setProfileId(null);
            setLoading(false);
          }
          return;
        }

        const { data: userData } = await supabase.auth.getUser();
        const email = userData.user?.email ?? '';
        const wallet = email.split('@')[0];
        const { data, error } = await supabase
          .from('profiles')
          .select('id, is_admin')
          .eq('wallet_address', wallet)
          .single();
        if (error) {
          if (!cancelled) {
            setIsAdmin(false);
            setProfileId(null);
          }
        } else if (!cancelled) {
          setIsAdmin(Boolean(data?.is_admin));
          setProfileId(data?.id ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, isAdmin, profileId };
}




