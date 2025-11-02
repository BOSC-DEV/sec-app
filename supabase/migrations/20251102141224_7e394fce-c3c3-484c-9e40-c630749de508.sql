-- Fix profiles INSERT RLS policy to work with email-based auth
-- Drop and recreate INSERT policy to extract wallet from email instead of raw_user_meta_data

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (
  SPLIT_PART(auth.jwt()->>'email', '@', 1) = LOWER(wallet_address)
);

COMMENT ON POLICY "Users can insert own profile" ON public.profiles IS 
'Users can create their own profile by matching wallet_address extracted from their email (case-insensitive)';