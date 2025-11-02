-- Grant SELECT access on auth.users to authenticated role
-- This is required for RLS policies that query auth.users.raw_user_meta_data
-- Note: Supabase's security model allows this for authenticated users

GRANT SELECT ON auth.users TO authenticated;

COMMENT ON GRANT SELECT ON auth.users TO authenticated IS 
'Allows authenticated users to query their own auth record in RLS policies. Required for policies that check raw_user_meta_data for wallet_address.';

