-- Fix profiles table RLS policies
-- Multiple conflicting policies exist from different migrations
-- This consolidates them into the correct versions

-- Drop ALL existing profile policies first
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Create correct SELECT policy: everyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

-- Create correct UPDATE policy: users can update their own profile by wallet
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (
  wallet_address = (
    SELECT raw_user_meta_data->>'wallet_address' 
    FROM auth.users 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  wallet_address = (
    SELECT raw_user_meta_data->>'wallet_address' 
    FROM auth.users 
    WHERE id = auth.uid()
  )
);

-- Create correct INSERT policy: users can insert profile matching their wallet
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (
  wallet_address = (
    SELECT raw_user_meta_data->>'wallet_address' 
    FROM auth.users 
    WHERE id = auth.uid()
  )
);

COMMENT ON POLICY "Profiles are viewable by everyone" ON public.profiles IS 
'Allows anyone to view profile information (consistent across migrations)';

COMMENT ON POLICY "Users can update own profile" ON public.profiles IS 
'Users can update their own profile by matching wallet_address to their auth metadata';

COMMENT ON POLICY "Users can insert own profile" ON public.profiles IS 
'Users can create their own profile matching their wallet_address';

