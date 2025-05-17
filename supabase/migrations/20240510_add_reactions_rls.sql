-- Enable RLS for reaction tables
ALTER TABLE IF EXISTS public.announcement_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reply_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_message_reactions ENABLE ROW LEVEL SECURITY;

-- Announcement reactions policies
CREATE POLICY IF NOT EXISTS "Anyone can view announcement reactions" 
ON public.announcement_reactions
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Users can create their own announcement reactions" 
ON public.announcement_reactions
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own announcement reactions" 
ON public.announcement_reactions
FOR DELETE
USING (auth.uid()::text = user_id);

-- Reply reactions policies
CREATE POLICY IF NOT EXISTS "Anyone can view reply reactions" 
ON public.reply_reactions
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Users can create their own reply reactions" 
ON public.reply_reactions
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own reply reactions" 
ON public.reply_reactions
FOR DELETE
USING (auth.uid()::text = user_id);

-- Chat message reactions policies
CREATE POLICY IF NOT EXISTS "Anyone can view chat message reactions" 
ON public.chat_message_reactions
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Users can create their own chat message reactions" 
ON public.chat_message_reactions
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own chat message reactions" 
ON public.chat_message_reactions
FOR DELETE
USING (auth.uid()::text = user_id); 