-- Create function to get public statistics (bypasses RLS for read-only counts)
CREATE OR REPLACE FUNCTION public.get_public_statistics()
RETURNS TABLE(
  total_bounty numeric,
  scammers_count bigint,
  reporters_count bigint,
  users_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Total bounty amount from all scammers
    COALESCE(SUM(s.bounty_amount), 0) as total_bounty,
    -- Total scammers count (excluding deleted)
    COUNT(DISTINCT s.id) as scammers_count,
    -- Unique reporters count
    COUNT(DISTINCT s.added_by) FILTER (WHERE s.added_by IS NOT NULL) as reporters_count,
    -- Total users count
    (SELECT COUNT(*) FROM public.profiles) as users_count
  FROM public.scammers s
  WHERE s.deleted_at IS NULL;
END;
$$;