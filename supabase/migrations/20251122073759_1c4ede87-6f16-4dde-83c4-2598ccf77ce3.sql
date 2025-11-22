-- Create comment_reactions table for tracking individual user reactions
CREATE TABLE IF NOT EXISTS public.comment_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(comment_id, user_id, reaction_type)
);

-- Enable RLS
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Comment reactions viewable by everyone" 
ON public.comment_reactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can add comment reactions" 
ON public.comment_reactions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own comment reactions" 
ON public.comment_reactions 
FOR DELETE 
USING (user_id = (
  SELECT id FROM profiles 
  WHERE wallet_address = (
    SELECT raw_user_meta_data->>'wallet_address' 
    FROM auth.users 
    WHERE id = auth.uid()
  )
));

-- Create atomic function for comment reactions
CREATE OR REPLACE FUNCTION public.toggle_comment_reaction(
  p_comment_id uuid,
  p_user_id uuid,
  p_reaction_type text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_reaction text;
  v_likes int;
  v_dislikes int;
BEGIN
  -- Get existing reaction if any
  SELECT reaction_type INTO v_existing_reaction
  FROM comment_reactions
  WHERE comment_id = p_comment_id 
    AND user_id = p_user_id
    AND reaction_type IN ('like', 'dislike');

  -- Handle the reaction logic
  IF v_existing_reaction = p_reaction_type THEN
    -- Same reaction: remove it
    DELETE FROM comment_reactions
    WHERE comment_id = p_comment_id 
      AND user_id = p_user_id 
      AND reaction_type = p_reaction_type;
    
    -- Decrement count
    IF p_reaction_type = 'like' THEN
      UPDATE comments 
      SET likes = GREATEST(0, COALESCE(likes, 0) - 1)
      WHERE id = p_comment_id;
    ELSE
      UPDATE comments 
      SET dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
      WHERE id = p_comment_id;
    END IF;
  ELSIF v_existing_reaction IS NOT NULL THEN
    -- Opposite reaction: switch it
    UPDATE comment_reactions
    SET reaction_type = p_reaction_type
    WHERE comment_id = p_comment_id 
      AND user_id = p_user_id;
    
    -- Update both counts
    IF p_reaction_type = 'like' THEN
      UPDATE comments 
      SET likes = COALESCE(likes, 0) + 1,
          dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
      WHERE id = p_comment_id;
    ELSE
      UPDATE comments 
      SET dislikes = COALESCE(dislikes, 0) + 1,
          likes = GREATEST(0, COALESCE(likes, 0) - 1)
      WHERE id = p_comment_id;
    END IF;
  ELSE
    -- No reaction: add new one
    INSERT INTO comment_reactions (comment_id, user_id, reaction_type)
    VALUES (p_comment_id, p_user_id, p_reaction_type);
    
    -- Increment count
    IF p_reaction_type = 'like' THEN
      UPDATE comments 
      SET likes = COALESCE(likes, 0) + 1
      WHERE id = p_comment_id;
    ELSE
      UPDATE comments 
      SET dislikes = COALESCE(dislikes, 0) + 1
      WHERE id = p_comment_id;
    END IF;
  END IF;

  -- Get final counts
  SELECT COALESCE(likes, 0), COALESCE(dislikes, 0)
  INTO v_likes, v_dislikes
  FROM comments
  WHERE id = p_comment_id;

  RETURN json_build_object('likes', v_likes, 'dislikes', v_dislikes);
END;
$$;