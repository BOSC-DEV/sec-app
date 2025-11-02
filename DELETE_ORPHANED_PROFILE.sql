-- Delete the old orphaned profile (created at 06:59)
-- The trigger should have already created a new one at 09:31, but if not, it will on next login

DELETE FROM public.profiles
WHERE id = 'd44882af-659a-4636-9e76-908c21aab1f9';

-- Check if trigger created a profile for the new user (created at 09:31)
-- If no profile exists, we need to check if trigger is working
SELECT 
  p.id as profile_id,
  p.wallet_address,
  p.created_at as profile_created_at,
  u.id as user_id,
  u.created_at as user_created_at,
  CASE 
    WHEN u.created_at > p.created_at THEN 'Profile is older than user - ORPHAN'
    WHEN p.created_at > u.created_at THEN 'Profile is newer than user - ISSUE'
    ELSE 'Timestamps match - OK'
  END as status
FROM public.profiles p
FULL OUTER JOIN auth.users u ON LOWER(SPLIT_PART(u.email, '@', 1)) = LOWER(p.wallet_address)
WHERE LOWER(p.wallet_address) = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w'
   OR LOWER(SPLIT_PART(u.email, '@', 1)) = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w';

