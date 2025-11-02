-- Fix profiles UPDATE RLS policy to work with email-based auth and be case-insensitive
-- Drop and recreate UPDATE policy to match INSERT policy approach

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (
  SPLIT_PART(auth.jwt()->>'email', '@', 1) = LOWER(wallet_address)
)
WITH CHECK (
  SPLIT_PART(auth.jwt()->>'email', '@', 1) = LOWER(wallet_address)
);

COMMENT ON POLICY "Users can update own profile" ON public.profiles IS 
'Users can update their own profile by matching wallet_address extracted from their email (case-insensitive)';