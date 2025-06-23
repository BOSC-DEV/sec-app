
-- Drop the existing dangerous policy that allows anyone to delete comments
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

-- Create a new secure policy that only allows users to delete their own comments
CREATE POLICY "Users can delete only their own comments" 
ON public.comments
FOR DELETE
USING (auth.uid()::text = author);

-- Also ensure the update policy is secure
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;

CREATE POLICY "Users can update only their own comments" 
ON public.comments
FOR UPDATE
USING (auth.uid()::text = author);

-- Verify insert policy is also secure
DROP POLICY IF EXISTS "Users can create own comments" ON public.comments;

CREATE POLICY "Users can create own comments" 
ON public.comments
FOR INSERT 
WITH CHECK (auth.uid()::text = author);
