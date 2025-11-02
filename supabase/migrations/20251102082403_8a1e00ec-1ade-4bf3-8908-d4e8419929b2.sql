-- Fix profiles RLS policies
-- Drop all conflicting policies and create single correct ones

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create single correct SELECT policy
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

-- Create single correct UPDATE policy
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

-- Create single correct INSERT policy
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