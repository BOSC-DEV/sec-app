-- HARD DELETE user completely (not soft delete)
-- Run this in Supabase SQL Editor

-- Step 1: Check if user exists
SELECT 
  id,
  email,
  created_at,
  deleted_at
FROM auth.users
WHERE email = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w@sec.digital';

-- Step 2: Hard delete from auth.users
DELETE FROM auth.users
WHERE email = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w@sec.digital';

-- Step 3: Also delete the profile
DELETE FROM public.profiles
WHERE wallet_address IN (
  '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W',
  '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w'
);

-- Step 4: Verify everything is deleted
SELECT 'auth.users count:' as table_name, COUNT(*) as count
FROM auth.users
WHERE email = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w@sec.digital'
UNION ALL
SELECT 'profiles count:' as table_name, COUNT(*) as count
FROM public.profiles
WHERE LOWER(wallet_address) = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w';

