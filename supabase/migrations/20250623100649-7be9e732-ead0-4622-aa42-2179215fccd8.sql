
-- Drop the secure policies that were added
DROP POLICY IF EXISTS "Users can delete only their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update only their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can create own comments" ON public.comments;

-- Restore the original policies (if they existed)
CREATE POLICY "Users can delete own comments" 
ON public.comments
FOR DELETE
USING (true);

CREATE POLICY "Users can update own comments" 
ON public.comments
FOR UPDATE
USING (true);

CREATE POLICY "Users can create own comments" 
ON public.comments
FOR INSERT 
WITH CHECK (true);
