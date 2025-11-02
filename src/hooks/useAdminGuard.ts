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
        const userId = userData.user?.id;
        const email = userData.user?.email ?? '';
        const wallet = email.split('@')[0];

        if (!userId) {
          if (!cancelled) {
            setIsAdmin(false);
            setProfileId(null);
            setLoading(false);
          }
          return;
        }

        // Get profile ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('wallet_address', wallet)
          .single();

        if (profileError) {
          if (!cancelled) {
            setIsAdmin(false);
            setProfileId(null);
            setLoading(false);
          }
          return;
        }

        // Check if user has admin role in user_roles table (SECURE)
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();

        if (!cancelled) {
          setIsAdmin(Boolean(roleData && !roleError));
          setProfileId(profileData?.id ?? null);
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




