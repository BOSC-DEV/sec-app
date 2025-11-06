-- Fix RLS policies for bounty_contributions UPDATE and DELETE
-- The issue: contributor_id stores profile IDs, not auth user IDs
-- Solution: Get profile ID from auth user's wallet address and compare with contributor_id

-- Drop the existing incorrect policies
DROP POLICY IF EXISTS "Users can update own contributions" ON public.bounty_contributions;
DROP POLICY IF EXISTS "Users can delete own contributions" ON public.bounty_contributions;

-- Create correct UPDATE policy that matches profile ID
CREATE POLICY "Users can update own contributions"
ON public.bounty_contributions
FOR UPDATE
USING (
  contributor_id = (
    SELECT id
    FROM public.profiles
    WHERE LOWER(wallet_address) = LOWER(
      COALESCE(
        (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()),
        SPLIT_PART(auth.jwt()->>'email', '@', 1)
      )
    )
  )
);

-- Create correct DELETE policy that matches profile ID
CREATE POLICY "Users can delete own contributions"
ON public.bounty_contributions
FOR DELETE
USING (
  contributor_id = (
    SELECT id
    FROM public.profiles
    WHERE LOWER(wallet_address) = LOWER(
      COALESCE(
        (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()),
        SPLIT_PART(auth.jwt()->>'email', '@', 1)
      )
    )
  )
);

COMMENT ON POLICY "Users can update own contributions" ON public.bounty_contributions IS 
'Users can update their own contributions by matching their profile ID (derived from wallet address) with contributor_id';

COMMENT ON POLICY "Users can delete own contributions" ON public.bounty_contributions IS 
'Users can delete their own contributions by matching their profile ID (derived from wallet address) with contributor_id';

