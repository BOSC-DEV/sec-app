-- Grant SELECT on auth.users to authenticated role
-- This allows RLS policies to query auth.users for wallet_address lookups
GRANT SELECT ON auth.users TO authenticated;