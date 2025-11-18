-- Fix RLS policy for scammers table to only allow creators to update their own reports
DROP POLICY IF EXISTS "Authenticated users can update scammers" ON scammers;

CREATE POLICY "Users can update their own scammers" ON scammers
FOR UPDATE 
USING (
  added_by IN (
    SELECT id FROM profiles 
    WHERE LOWER(wallet_address) = LOWER(SPLIT_PART(auth.jwt()->>'email', '@', 1))
  )
);