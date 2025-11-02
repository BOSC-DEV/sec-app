-- Cleanup script to find and delete orphaned profiles
-- Profiles that exist but their auth user doesn't exist

-- Step 1: Find orphaned profiles (profiles without matching auth user)
SELECT 
  p.id,
  p.wallet_address,
  p.username,
  p.created_at,
  'ORPHANED' as status
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 
  FROM auth.users u
  WHERE u.email = lower(p.wallet_address || '@sec.digital')
)
ORDER BY p.created_at DESC;

-- Step 2: Delete orphaned profiles (uncomment to run)
-- DELETE FROM public.profiles
-- WHERE NOT EXISTS (
--   SELECT 1 
--   FROM auth.users u
--   WHERE u.email = lower(wallet_address || '@sec.digital')
-- );

-- Step 3: Find duplicate wallet_addresses (if any)
SELECT 
  wallet_address,
  COUNT(*) as count,
  array_agg(id) as profile_ids
FROM public.profiles
GROUP BY wallet_address
HAVING COUNT(*) > 1;

-- Step 4: Check for profiles with specific wallet_address
SELECT 
  id,
  wallet_address,
  username,
  created_at
FROM public.profiles
WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';

