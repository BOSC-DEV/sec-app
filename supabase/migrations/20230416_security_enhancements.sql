-- Enable Row Level Security on tables that may need protection

-- Scammers table
ALTER TABLE IF EXISTS public.scammers ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anonymous users to see all non-deleted scammers
CREATE POLICY IF NOT EXISTS "Anyone can view non-deleted scammers" 
ON public.scammers
FOR SELECT 
USING (deleted_at IS NULL);

-- Create policy that allows users to view their own deleted scammers
CREATE POLICY IF NOT EXISTS "Users can view their own deleted scammers" 
ON public.scammers
FOR SELECT 
USING (auth.uid()::text = added_by);

-- Create policy that allows users to insert their own scammers
CREATE POLICY IF NOT EXISTS "Users can create their own scammers" 
ON public.scammers
FOR INSERT 
WITH CHECK (auth.uid()::text = added_by);

-- Create policy that allows users to update their own scammers
CREATE POLICY IF NOT EXISTS "Users can update their own scammers" 
ON public.scammers
FOR UPDATE
USING (auth.uid()::text = added_by);

-- Profiles table
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view profiles
CREATE POLICY IF NOT EXISTS "Anyone can view profiles" 
ON public.profiles
FOR SELECT 
USING (true);

-- Create policy that allows users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE
USING (SPLIT_PART(auth.jwt()->>'email', '@', 1) = LOWER(wallet_address));

-- Create policy that allows users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles
FOR INSERT
WITH CHECK (SPLIT_PART(auth.jwt()->>'email', '@', 1) = LOWER(wallet_address));

-- Bounty contributions
ALTER TABLE IF EXISTS public.bounty_contributions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view bounty contributions
CREATE POLICY IF NOT EXISTS "Anyone can view bounty contributions" 
ON public.bounty_contributions
FOR SELECT 
USING (true);

-- Create policy that allows authenticated users to add contributions
CREATE POLICY IF NOT EXISTS "Authenticated users can add contributions" 
ON public.bounty_contributions
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy that allows users to update only their own contributions
CREATE POLICY IF NOT EXISTS "Users can update own contributions" 
ON public.bounty_contributions
FOR UPDATE
USING (auth.uid()::text = contributor_id);

-- Create policy that allows users to delete only their own contributions
CREATE POLICY IF NOT EXISTS "Users can delete own contributions" 
ON public.bounty_contributions
FOR DELETE
USING (auth.uid()::text = contributor_id);

-- User scammer interactions (likes, etc)
ALTER TABLE IF EXISTS public.user_scammer_interactions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to select their own interactions
CREATE POLICY IF NOT EXISTS "Users can view own interactions" 
ON public.user_scammer_interactions
FOR SELECT 
USING (auth.uid()::text = user_id);

-- Create policy that allows users to insert their own interactions
CREATE POLICY IF NOT EXISTS "Users can create own interactions" 
ON public.user_scammer_interactions
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Create policy that allows users to update their own interactions
CREATE POLICY IF NOT EXISTS "Users can update own interactions" 
ON public.user_scammer_interactions
FOR UPDATE
USING (auth.uid()::text = user_id);

-- Comments
ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view comments
CREATE POLICY IF NOT EXISTS "Anyone can view comments" 
ON public.comments
FOR SELECT 
USING (true);

-- Create policy that allows users to insert their own comments
CREATE POLICY IF NOT EXISTS "Users can create own comments" 
ON public.comments
FOR INSERT 
WITH CHECK (auth.uid()::text = author);

-- Create policy that allows users to update their own comments
CREATE POLICY IF NOT EXISTS "Users can update own comments" 
ON public.comments
FOR UPDATE
USING (auth.uid()::text = author);

-- Create policy that allows users to delete their own comments
CREATE POLICY IF NOT EXISTS "Users can delete own comments" 
ON public.comments
FOR DELETE
USING (auth.uid()::text = author);

-- Add security definer function to validate inputs
CREATE OR REPLACE FUNCTION public.validate_and_sanitize_text(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Basic sanitization - remove potentially harmful characters
  input_text := regexp_replace(input_text, '<script.*?>.*?</script>', '', 'gi');
  input_text := regexp_replace(input_text, 'javascript:', '', 'gi');
  input_text := regexp_replace(input_text, 'onload=', '', 'gi');
  input_text := regexp_replace(input_text, 'onerror=', '', 'gi');
  
  RETURN input_text;
END;
$$;

-- Add validation trigger to scammers table for XSS prevention
CREATE OR REPLACE FUNCTION public.validate_scammer_inputs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Sanitize text fields to prevent XSS
  NEW.name := public.validate_and_sanitize_text(NEW.name);
  IF NEW.accused_of IS NOT NULL THEN
    NEW.accused_of := public.validate_and_sanitize_text(NEW.accused_of);
  END IF;
  
  IF NEW.official_response IS NOT NULL THEN
    NEW.official_response := public.validate_and_sanitize_text(NEW.official_response);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_scammer_inputs_trigger ON public.scammers;
CREATE TRIGGER validate_scammer_inputs_trigger
BEFORE INSERT OR UPDATE ON public.scammers
FOR EACH ROW
EXECUTE FUNCTION public.validate_scammer_inputs();

-- Add validation trigger to profiles table for XSS prevention
CREATE OR REPLACE FUNCTION public.validate_profile_inputs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Sanitize text fields to prevent XSS
  IF NEW.display_name IS NOT NULL THEN
    NEW.display_name := public.validate_and_sanitize_text(NEW.display_name);
  END IF;
  
  IF NEW.username IS NOT NULL THEN
    NEW.username := public.validate_and_sanitize_text(NEW.username);
  END IF;
  
  IF NEW.bio IS NOT NULL THEN
    NEW.bio := public.validate_and_sanitize_text(NEW.bio);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_profile_inputs_trigger ON public.profiles;
CREATE TRIGGER validate_profile_inputs_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.validate_profile_inputs();

-- Add validation trigger to comments table for XSS prevention
CREATE OR REPLACE FUNCTION public.validate_comment_inputs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Sanitize text fields to prevent XSS
  NEW.content := public.validate_and_sanitize_text(NEW.content);
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_comment_inputs_trigger ON public.comments;
CREATE TRIGGER validate_comment_inputs_trigger
BEFORE INSERT OR UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.validate_comment_inputs();
