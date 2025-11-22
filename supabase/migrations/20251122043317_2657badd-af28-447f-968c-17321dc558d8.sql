-- First, sync all existing scammers.views with actual count from scammer_views
UPDATE public.scammers s
SET views = (
  SELECT COUNT(*)
  FROM public.scammer_views sv
  WHERE sv.scammer_id = s.id
);

-- Create trigger function to increment scammers.views when a view is tracked
CREATE OR REPLACE FUNCTION public.increment_scammer_views()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.scammers
  SET views = COALESCE(views, 0) + 1
  WHERE id = NEW.scammer_id;
  
  RETURN NEW;
END;
$$;

-- Attach trigger to scammer_views table
CREATE TRIGGER on_scammer_view_insert
  AFTER INSERT ON public.scammer_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_scammer_views();