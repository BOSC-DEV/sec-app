-- Fix user_scammer_interactions to prevent duplicate likes and persist state

-- Step 1: Clean up duplicate records (keep most recent for each user-scammer pair)
DELETE FROM user_scammer_interactions
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, scammer_id) id
  FROM user_scammer_interactions
  ORDER BY user_id, scammer_id, updated_at DESC
);

-- Step 2: Add unique constraint to prevent future duplicates
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_scammer_interaction 
ON user_scammer_interactions(user_id, scammer_id);

-- Step 3: Fix RLS policies with simplified logic that actually works

-- DROP existing policies
DROP POLICY IF EXISTS "Users can view their own interactions" ON user_scammer_interactions;
DROP POLICY IF EXISTS "Users can insert their own interactions" ON user_scammer_interactions;
DROP POLICY IF EXISTS "Users can update their own interactions" ON user_scammer_interactions;

-- CREATE simplified SELECT policy
CREATE POLICY "Users can view their own interactions" 
ON user_scammer_interactions
FOR SELECT 
USING (
  user_id IN (
    SELECT id FROM profiles 
    WHERE LOWER(wallet_address) = LOWER(SPLIT_PART(auth.jwt()->>'email', '@', 1))
  )
);

-- CREATE simplified INSERT policy that validates user_id
CREATE POLICY "Users can insert their own interactions" 
ON user_scammer_interactions
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND
  user_id IN (
    SELECT id FROM profiles 
    WHERE LOWER(wallet_address) = LOWER(SPLIT_PART(auth.jwt()->>'email', '@', 1))
  )
);

-- CREATE simplified UPDATE policy
CREATE POLICY "Users can update their own interactions" 
ON user_scammer_interactions
FOR UPDATE 
USING (
  user_id IN (
    SELECT id FROM profiles 
    WHERE LOWER(wallet_address) = LOWER(SPLIT_PART(auth.jwt()->>'email', '@', 1))
  )
);