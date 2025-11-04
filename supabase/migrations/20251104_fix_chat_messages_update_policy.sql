-- Fix chat_messages UPDATE policy to allow updating likes/dislikes counts
-- Without this policy, the likeChatMessage and dislikeChatMessage functions cannot update the counts

DROP POLICY IF EXISTS "Authenticated users can update chat messages" ON public.chat_messages;

CREATE POLICY "Authenticated users can update chat messages"
ON public.chat_messages
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

COMMENT ON POLICY "Authenticated users can update chat messages" ON public.chat_messages IS 
'Allows authenticated users to update chat messages (e.g., likes/dislikes counts). Required for reaction functionality.';
