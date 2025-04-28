
-- This migration fixes the "Function Search Path Mutable" warnings by setting explicit search paths
-- The warnings occur because these functions don't have the search_path parameter set,
-- which could potentially lead to schema injection attacks

-- Fix search_path for public.is_duplicate_view
CREATE OR REPLACE FUNCTION public.is_duplicate_view(p_scammer_id text, p_ip_hash text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.scammer_views
    WHERE scammer_id = p_scammer_id 
    AND ip_hash = p_ip_hash
    AND created_at > CURRENT_DATE
  );
END;
$function$;

-- Fix search_path for public.is_admin
CREATE OR REPLACE FUNCTION public.is_admin(username_param text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Add additional admin checks here if needed
  RETURN FALSE;
END;
$function$;

-- Fix search_path for public.increment_announcement_views
CREATE OR REPLACE FUNCTION public.increment_announcement_views(p_announcement_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    UPDATE public.announcements
    SET views = views + 1
    WHERE id = p_announcement_id;
END;
$function$;

-- Fix search_path for public.check_report_rate_limits
CREATE OR REPLACE FUNCTION public.check_report_rate_limits(p_user_id text, p_ip_hash text)
 RETURNS TABLE(allowed boolean, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_user_daily_count INT;
  v_user_monthly_count INT;
  v_ip_hourly_count INT;
  v_ip_daily_count INT;
  v_global_monthly_count INT;
  v_current_ts TIMESTAMPTZ := now();
  v_daily_start TIMESTAMPTZ := date_trunc('day', v_current_ts);
  v_hourly_start TIMESTAMPTZ := date_trunc('hour', v_current_ts);
  v_monthly_start TIMESTAMPTZ := date_trunc('month', v_current_ts);
BEGIN
  -- Keep existing code
  -- Check global monthly limit (1000 per month)
  SELECT COUNT(*) INTO v_global_monthly_count
  FROM public.report_submissions
  WHERE created_at >= v_monthly_start;
  
  IF v_global_monthly_count >= 1000 THEN
    RETURN QUERY SELECT false::BOOLEAN, 'Global monthly report limit reached'::TEXT;
    RETURN;
  END IF;

  -- Check IP-based limits
  -- 5 reports per hour
  SELECT COUNT(*) INTO v_ip_hourly_count
  FROM public.report_submissions
  WHERE ip_hash = p_ip_hash
    AND created_at >= v_hourly_start;
    
  IF v_ip_hourly_count >= 5 THEN
    RETURN QUERY SELECT false::BOOLEAN, 'Hourly report limit reached for your IP address'::TEXT;
    RETURN;
  END IF;
  
  -- 20 reports per day (IP-based)
  SELECT COUNT(*) INTO v_ip_daily_count
  FROM public.report_submissions
  WHERE ip_hash = p_ip_hash
    AND created_at >= v_daily_start;
    
  IF v_ip_daily_count >= 20 THEN
    RETURN QUERY SELECT false::BOOLEAN, 'Daily report limit reached for your IP address'::TEXT;
    RETURN;
  END IF;
  
  -- Check user-based limits (if user is logged in)
  IF p_user_id IS NOT NULL THEN
    -- 20 reports per day
    SELECT COUNT(*) INTO v_user_daily_count
    FROM public.report_submissions
    WHERE user_id = p_user_id
      AND created_at >= v_daily_start;
      
    IF v_user_daily_count >= 20 THEN
      RETURN QUERY SELECT false::BOOLEAN, 'Daily report limit reached for your account'::TEXT;
      RETURN;
    END IF;
    
    -- 50 reports per month
    SELECT COUNT(*) INTO v_user_monthly_count
    FROM public.report_submissions
    WHERE user_id = p_user_id
      AND created_at >= v_monthly_start;
      
    IF v_user_monthly_count >= 50 THEN
      RETURN QUERY SELECT false::BOOLEAN, 'Monthly report limit reached for your account'::TEXT;
      RETURN;
    END IF;
  END IF;
  
  -- All checks passed
  RETURN QUERY SELECT true::BOOLEAN, 'Rate limits ok'::TEXT;
END;
$function$;

-- Fix search_path for public.record_report_submission
CREATE OR REPLACE FUNCTION public.record_report_submission(p_user_id text, p_ip_hash text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.report_submissions(user_id, ip_hash)
  VALUES (p_user_id, p_ip_hash)
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$function$;

-- Fix search_path for public.track_visitor
CREATE OR REPLACE FUNCTION public.track_visitor(p_visitor_id text, p_ip_address text, p_user_agent text, p_country_code text DEFAULT NULL::text, p_country_name text DEFAULT NULL::text, p_city text DEFAULT NULL::text, p_referrer text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  v_visitor_record RECORD;
  v_visitor_id UUID;
BEGIN
  -- Check if visitor already exists
  SELECT id INTO v_visitor_record FROM public.analytics_visitors WHERE visitor_id = p_visitor_id;
  
  IF v_visitor_record IS NULL THEN
    -- Insert new visitor
    INSERT INTO public.analytics_visitors 
      (visitor_id, ip_address, user_agent, country_code, country_name, city, referrer)
    VALUES 
      (p_visitor_id, p_ip_address, p_user_agent, p_country_code, p_country_name, p_city, p_referrer)
    RETURNING id INTO v_visitor_id;
  ELSE
    -- Update existing visitor
    UPDATE public.analytics_visitors
    SET 
      last_visit_at = now(),
      visit_count = visit_count + 1,
      ip_address = p_ip_address,
      user_agent = p_user_agent,
      country_code = COALESCE(p_country_code, country_code),
      country_name = COALESCE(p_country_name, country_name),
      city = COALESCE(p_city, city),
      referrer = COALESCE(p_referrer, referrer)
    WHERE visitor_id = p_visitor_id
    RETURNING id INTO v_visitor_id;
  END IF;
  
  RETURN v_visitor_id;
END;
$function$;

-- Fix search_path for public.track_pageview
CREATE OR REPLACE FUNCTION public.track_pageview(p_visitor_id text, p_page_path text, p_page_title text DEFAULT NULL::text, p_session_id text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  v_pageview_id UUID;
BEGIN
  INSERT INTO public.analytics_pageviews 
    (visitor_id, page_path, page_title, session_id)
  VALUES 
    (p_visitor_id, p_page_path, p_page_title, p_session_id)
  RETURNING id INTO v_pageview_id;
  
  RETURN v_pageview_id;
END;
$function$;

-- Fix search_path for public.get_daily_visitors
CREATE OR REPLACE FUNCTION public.get_daily_visitors()
 RETURNS TABLE(day timestamp with time zone, unique_visitors bigint, total_visits bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    day,
    unique_visitors,
    total_visits
  FROM analytics_daily_visitors
  LIMIT 30;  -- Limit to last 30 days
END;
$function$;

-- Fix search_path for public.get_country_stats
CREATE OR REPLACE FUNCTION public.get_country_stats()
 RETURNS TABLE(country_code text, country_name text, visitor_count bigint, visit_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    country_code,
    country_name,
    visitor_count,
    visit_count
  FROM analytics_country_stats
  ORDER BY visit_count DESC
  LIMIT 50;  -- Limit to top 50 countries
END;
$function$;

-- Fix search_path for public.update_delegation_limit
CREATE OR REPLACE FUNCTION public.update_delegation_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Set delegation limit based on SEC balance tiers
  NEW.delegation_limit := 
    CASE 
      WHEN NEW.sec_balance >= 10000000 THEN 11  -- Whale
      WHEN NEW.sec_balance >= 7000000 THEN 10   -- Goat
      WHEN NEW.sec_balance >= 5000000 THEN 9    -- T-Rex
      WHEN NEW.sec_balance >= 3000000 THEN 8    -- Great Ape
      WHEN NEW.sec_balance >= 2000000 THEN 7    -- Bald Eagle
      WHEN NEW.sec_balance >= 1000000 THEN 6    -- Bull Shark
      WHEN NEW.sec_balance >= 600000 THEN 5     -- King Cobra
      WHEN NEW.sec_balance >= 400000 THEN 4     -- Lion
      WHEN NEW.sec_balance >= 200000 THEN 3     -- Bull
      WHEN NEW.sec_balance >= 100000 THEN 2     -- Frog
      ELSE 1                                    -- Shrimp
    END;
  RETURN NEW;
END;
$function$;

-- Fix search_path for public.upsert_profile
CREATE OR REPLACE FUNCTION public.upsert_profile(profile_id uuid, profile_display_name text, profile_username text, profile_pic_url text, profile_wallet_address text, profile_created_at timestamp with time zone, profile_x_link text, profile_website_link text, profile_bio text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Try to update by ID first
  UPDATE public.profiles SET
    display_name = profile_display_name,
    username = profile_username,
    profile_pic_url = profile_pic_url,
    x_link = profile_x_link,
    website_link = profile_website_link,
    bio = profile_bio
  WHERE id = profile_id;
  
  -- If no rows were updated, try to update by wallet_address
  IF NOT FOUND THEN
    UPDATE public.profiles SET
      display_name = profile_display_name,
      username = profile_username,
      profile_pic_url = profile_pic_url,
      x_link = profile_x_link,
      website_link = profile_website_link,
      bio = profile_bio
    WHERE wallet_address = profile_wallet_address;
    
    -- If still no rows were updated, insert a new record
    IF NOT FOUND THEN
      INSERT INTO public.profiles (
        id, 
        display_name, 
        username, 
        profile_pic_url, 
        wallet_address, 
        created_at, 
        x_link, 
        website_link, 
        bio
      ) VALUES (
        profile_id, 
        profile_display_name, 
        profile_username, 
        profile_pic_url, 
        profile_wallet_address, 
        profile_created_at, 
        profile_x_link, 
        profile_website_link, 
        profile_bio
      );
    END IF;
  END IF;
END;
$function$;
