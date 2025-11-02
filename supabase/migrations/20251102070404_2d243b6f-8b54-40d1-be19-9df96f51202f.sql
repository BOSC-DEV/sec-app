-- Fix incorrect RLS policies that cause type errors
-- Old policies were using patterns that cause mismatches
-- New policies properly resolve profiles.id from wallet_address

-- ==========================================
-- Fix scammers table policies
-- ==========================================

DROP POLICY IF EXISTS "Authenticated users can create scammers" ON public.scammers;
DROP POLICY IF EXISTS "Authenticated users can update scammers" ON public.scammers;
DROP POLICY IF EXISTS "Scammers are viewable by everyone" ON public.scammers;

-- Keep public read access
CREATE POLICY "Scammers are viewable by everyone"
ON public.scammers
FOR SELECT
USING (true);

-- Add policy for users to view their own scammers (including deleted)
CREATE POLICY "Users can view own scammers"
ON public.scammers
FOR SELECT
USING (
  added_by = (
    SELECT id FROM public.profiles 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Authenticated users can create scammers"
ON public.scammers
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update scammers"
ON public.scammers
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- ==========================================
-- Fix user_scammer_interactions table policies
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own interactions" ON public.user_scammer_interactions;
DROP POLICY IF EXISTS "Users can insert their own interactions" ON public.user_scammer_interactions;
DROP POLICY IF EXISTS "Users can update their own interactions" ON public.user_scammer_interactions;

CREATE POLICY "Users can view their own interactions"
ON public.user_scammer_interactions
FOR SELECT
USING (
  user_id = (
    SELECT id FROM public.profiles 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Users can insert their own interactions"
ON public.user_scammer_interactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own interactions"
ON public.user_scammer_interactions
FOR UPDATE
USING (
  user_id = (
    SELECT id FROM public.profiles 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

-- ==========================================
-- Fix reactions tables policies
-- ==========================================

DROP POLICY IF EXISTS "Users can add reactions" ON public.announcement_reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON public.announcement_reactions;

CREATE POLICY "Users can add reactions"
ON public.announcement_reactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own reactions"
ON public.announcement_reactions
FOR DELETE
USING (
  user_id = (
    SELECT id FROM public.profiles 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Users can add reply reactions" ON public.reply_reactions;
DROP POLICY IF EXISTS "Users can delete own reply reactions" ON public.reply_reactions;

CREATE POLICY "Users can add reply reactions"
ON public.reply_reactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own reply reactions"
ON public.reply_reactions
FOR DELETE
USING (
  user_id = (
    SELECT id FROM public.profiles 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Users can add message reactions" ON public.chat_message_reactions;
DROP POLICY IF EXISTS "Users can delete own message reactions" ON public.chat_message_reactions;

CREATE POLICY "Users can add message reactions"
ON public.chat_message_reactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own message reactions"
ON public.chat_message_reactions
FOR DELETE
USING (
  user_id = (
    SELECT id FROM public.profiles 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

-- ==========================================
-- Fix comments table policies
-- ==========================================

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

CREATE POLICY "Authenticated users can create comments"
ON public.comments
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments"
ON public.comments
FOR UPDATE
USING (
  author = (
    SELECT id FROM public.profiles 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete own comments"
ON public.comments
FOR DELETE
USING (
  author = (
    SELECT id FROM public.profiles 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);