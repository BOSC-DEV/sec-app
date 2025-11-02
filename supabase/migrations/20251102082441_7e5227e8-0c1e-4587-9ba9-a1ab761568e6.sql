-- Fix all RLS policies that have UUID type errors
-- These policies incorrectly used auth.uid()::text = user_id pattern

-- Fix scammers policies
DROP POLICY IF EXISTS "Users can view own scammers" ON public.scammers;
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

-- Fix user_scammer_interactions policies
DROP POLICY IF EXISTS "Users can view their own interactions" ON public.user_scammer_interactions;
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

-- Fix announcement_reactions policies
DROP POLICY IF EXISTS "Users can delete own reactions" ON public.announcement_reactions;
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

-- Fix reply_reactions policies
DROP POLICY IF EXISTS "Users can delete own reply reactions" ON public.reply_reactions;
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

-- Fix chat_message_reactions policies
DROP POLICY IF EXISTS "Users can delete own message reactions" ON public.chat_message_reactions;
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

-- Fix comments policies
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

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