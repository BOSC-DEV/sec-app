-- Create atomic function for scammer reactions
CREATE OR REPLACE FUNCTION public.toggle_scammer_reaction(
  p_scammer_id uuid,
  p_user_id uuid,
  p_reaction_type text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_interaction record;
  v_likes int;
  v_dislikes int;
BEGIN
  -- Get existing interaction if any
  SELECT liked, disliked, id INTO v_existing_interaction
  FROM user_scammer_interactions
  WHERE scammer_id = p_scammer_id 
    AND user_id = p_user_id;

  -- Handle the reaction logic
  IF FOUND THEN
    IF p_reaction_type = 'like' THEN
      IF v_existing_interaction.liked THEN
        -- Already liked: unlike
        UPDATE user_scammer_interactions
        SET liked = false, updated_at = now()
        WHERE scammer_id = p_scammer_id AND user_id = p_user_id;
        
        UPDATE scammers 
        SET likes = GREATEST(0, COALESCE(likes, 0) - 1)
        WHERE id = p_scammer_id;
      ELSIF v_existing_interaction.disliked THEN
        -- Switch from dislike to like
        UPDATE user_scammer_interactions
        SET liked = true, disliked = false, updated_at = now()
        WHERE scammer_id = p_scammer_id AND user_id = p_user_id;
        
        UPDATE scammers 
        SET likes = COALESCE(likes, 0) + 1,
            dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
        WHERE id = p_scammer_id;
      ELSE
        -- No reaction: add like
        UPDATE user_scammer_interactions
        SET liked = true, updated_at = now()
        WHERE scammer_id = p_scammer_id AND user_id = p_user_id;
        
        UPDATE scammers 
        SET likes = COALESCE(likes, 0) + 1
        WHERE id = p_scammer_id;
      END IF;
    ELSE -- dislike
      IF v_existing_interaction.disliked THEN
        -- Already disliked: undislike
        UPDATE user_scammer_interactions
        SET disliked = false, updated_at = now()
        WHERE scammer_id = p_scammer_id AND user_id = p_user_id;
        
        UPDATE scammers 
        SET dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
        WHERE id = p_scammer_id;
      ELSIF v_existing_interaction.liked THEN
        -- Switch from like to dislike
        UPDATE user_scammer_interactions
        SET liked = false, disliked = true, updated_at = now()
        WHERE scammer_id = p_scammer_id AND user_id = p_user_id;
        
        UPDATE scammers 
        SET dislikes = COALESCE(dislikes, 0) + 1,
            likes = GREATEST(0, COALESCE(likes, 0) - 1)
        WHERE id = p_scammer_id;
      ELSE
        -- No reaction: add dislike
        UPDATE user_scammer_interactions
        SET disliked = true, updated_at = now()
        WHERE scammer_id = p_scammer_id AND user_id = p_user_id;
        
        UPDATE scammers 
        SET dislikes = COALESCE(dislikes, 0) + 1
        WHERE id = p_scammer_id;
      END IF;
    END IF;
  ELSE
    -- No existing interaction: create new one
    INSERT INTO user_scammer_interactions (scammer_id, user_id, liked, disliked)
    VALUES (
      p_scammer_id, 
      p_user_id, 
      p_reaction_type = 'like',
      p_reaction_type = 'dislike'
    );
    
    -- Increment count
    IF p_reaction_type = 'like' THEN
      UPDATE scammers 
      SET likes = COALESCE(likes, 0) + 1
      WHERE id = p_scammer_id;
    ELSE
      UPDATE scammers 
      SET dislikes = COALESCE(dislikes, 0) + 1
      WHERE id = p_scammer_id;
    END IF;
  END IF;

  -- Get final counts
  SELECT COALESCE(likes, 0), COALESCE(dislikes, 0)
  INTO v_likes, v_dislikes
  FROM scammers
  WHERE id = p_scammer_id;

  RETURN json_build_object('likes', v_likes, 'dislikes', v_dislikes);
END;
$$;