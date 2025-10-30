-- Restrict public access to wallet addresses in profiles
-- 1) Remove public SELECT on profiles
-- 2) Allow only authenticated users to SELECT profiles (full columns)
-- 3) Expose a public view without wallet_address for anonymous access

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop permissive public SELECT policy if it exists
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create stricter SELECT policy: only authenticated users can view profiles
CREATE POLICY IF NOT EXISTS "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Preserve existing write policies if present (no-ops if already defined elsewhere)
CREATE POLICY IF NOT EXISTS "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (
  -- Allow update when the requesting user's wallet_address matches the row
  (SELECT users.raw_user_meta_data->>'wallet_address' FROM auth.users AS users WHERE users.id = auth.uid()) = public.profiles.wallet_address
);

CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (
  (SELECT users.raw_user_meta_data->>'wallet_address' FROM auth.users AS users WHERE users.id = auth.uid()) = public.profiles.wallet_address
);

-- Create a public-facing view that excludes wallet_address
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id,
  username,
  display_name,
  profile_pic_url,
  bio,
  x_link,
  website_link,
  points,
  sec_balance,
  is_admin,
  created_at,
  updated_at
FROM public.profiles;

-- Grant read access on the view to anonymous and authenticated roles
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Provide a SECURITY DEFINER function to fetch public profiles without wallet addresses
-- This allows anon access even with RLS enabled on the base table.
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS SETOF public.public_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.public_profiles;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;


