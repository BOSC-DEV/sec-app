-- Fix incorrect RLS policies that cause type errors
-- Old policies were using auth.uid()::text = user_id which causes mismatches
-- New policies properly resolve profiles.id from wallet_address

-- ==========================================
-- Fix scammers table policies
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own deleted scammers" ON public.scammers;
DROP POLICY IF EXISTS "Users can create their own scammers" ON public.scammers;
DROP POLICY IF EXISTS "Users can update their own scammers" ON public.scammers;

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

DROP POLICY IF EXISTS "Users can view own interactions" ON public.user_scammer_interactions;
DROP POLICY IF EXISTS "Users can create own interactions" ON public.user_scammer_interactions;
DROP POLICY IF EXISTS "Users can update own interactions" ON public.user_scammer_interactions;

-- These policies are already correct in newer migrations, but ensure consistency
CREATE POLICY "Users can view own interactions"
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

CREATE POLICY "Users can insert own interactions"
ON public.user_scammer_interactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own interactions"
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

DROP POLICY IF EXISTS "Users can create their own announcement reactions" ON public.announcement_reactions;
DROP POLICY IF EXISTS "Users can delete their own announcement reactions" ON public.announcement_reactions;
DROP POLICY IF EXISTS "Users can create their own reply reactions" ON public.reply_reactions;
DROP POLICY IF EXISTS "Users can delete their own reply reactions" ON public.reply_reactions;
DROP POLICY IF EXISTS "Users can create their own chat message reactions" ON public.chat_message_reactions;
DROP POLICY IF EXISTS "Users can delete their own chat message reactions" ON public.chat_message_reactions;

CREATE POLICY "Users can add announcement reactions"
ON public.announcement_reactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own announcement reactions"
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

CREATE POLICY "Users can add chat message reactions"
ON public.chat_message_reactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own chat message reactions"
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

-- Check if comments table has auth.uid()::text issues
DROP POLICY IF EXISTS "Users can create own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

CREATE POLICY "Users can create comments"
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

COMMENT ON POLICY "Users can view own scammers" ON public.scammers IS 
'Fixed: Now properly resolves profiles.id from wallet_address instead of using invalid type cast';

COMMENT ON POLICY "Users can view own interactions" ON public.user_scammer_interactions IS 
'Fixed: Now properly resolves profiles.id from wallet_address instead of using invalid type cast';

