-- =====================================================
-- FIX CRITICAL SECURITY ISSUES
-- =====================================================

-- =====================================================
-- 1. Fix Report Submissions Privacy 🚨
-- Restrict access to submitter + admins only
-- =====================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Reports viewable by everyone" ON public.report_submissions;

-- Allow users to view their own reports only
CREATE POLICY "Users can view own reports"
ON public.report_submissions
FOR SELECT
USING (
  user_id = (
    SELECT p.id 
    FROM public.profiles p
    WHERE p.wallet_address = split_part((auth.jwt() ->> 'email'::text), '@'::text, 1)
    LIMIT 1
  )
);

-- Allow admins to view all reports for moderation
CREATE POLICY "Admins can view all reports"
ON public.report_submissions
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- =====================================================
-- 2. Mitigate Wallet Address Exposure
-- Create public view without wallet addresses
-- =====================================================

-- Create a view that exposes only public profile information
-- This excludes wallet_address to prevent targeted phishing
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT 
  id,
  username,
  display_name,
  profile_pic_url,
  bio,
  website_link,
  x_link,
  points,
  sec_balance,
  is_banned,
  suspended_until,
  created_at,
  updated_at
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Add security documentation
COMMENT ON VIEW public.profiles_public IS 
'Public view of profiles that excludes wallet_address field to prevent bulk scraping and targeted phishing attacks. Use this view for public-facing profile displays.';

-- =====================================================
-- 3. Restrict direct profiles table access
-- =====================================================

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Authenticated users can view profiles (needed for authenticated features)
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Anonymous users use profiles_public view instead
CREATE POLICY "Anonymous users restricted access"
ON public.profiles
FOR SELECT
TO anon
USING (
  -- Allow anonymous access only for specific authenticated operations
  -- For public viewing, use profiles_public view
  false
);