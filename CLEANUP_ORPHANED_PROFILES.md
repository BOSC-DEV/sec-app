# 🧹 Cleanup Orphaned Profiles - Fix "User Already Exists" Error

## Problem
After deleting a user in Supabase Dashboard, you're still getting `{"code":"user_already_registered"}` error.

**Cause:** Profile record still exists in `profiles` table with the same `wallet_address` (which has UNIQUE constraint).

## Solution: Delete Orphaned Profile

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Your project → **SQL Editor**
3. Click **New query**

### Step 2: Run Cleanup Script

Copy and paste this SQL:

```sql
-- Find the orphaned profile
SELECT 
  id,
  wallet_address,
  username,
  created_at
FROM public.profiles
WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';
```

This will show you the profile record.

### Step 3: Delete the Profile

```sql
-- Delete the orphaned profile
DELETE FROM public.profiles
WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';
```

**Or delete via Dashboard:**
1. Go to **Table Editor** → **profiles**
2. Find row with wallet_address: `4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W`
3. Click row → **Delete**

### Step 4: Verify Deletion

```sql
-- Verify profile is deleted
SELECT * FROM public.profiles
WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';
```

Should return empty.

### Step 5: Try Signup Again
- User connects wallet
- User signs message
- Account created successfully ✅

---

## Bulk Cleanup (Optional)

To find and delete ALL orphaned profiles:

```sql
-- Find all orphaned profiles
SELECT 
  p.id,
  p.wallet_address,
  p.username,
  p.created_at
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 
  FROM auth.users u
  WHERE u.email = lower(p.wallet_address || '@sec.digital')
);

-- Delete all orphaned profiles (uncomment to run)
-- DELETE FROM public.profiles
-- WHERE NOT EXISTS (
--   SELECT 1 
--   FROM auth.users u
--   WHERE u.email = lower(wallet_address || '@sec.digital')
-- );
```

---

## Why This Happens

When you delete a user in **Authentication → Users**:
- ✅ Auth user is deleted (`auth.users` table)
- ❌ Profile record remains (`profiles` table)

The `profiles.wallet_address` has a UNIQUE constraint, so:
- Signup tries to create new profile
- UNIQUE constraint violation → "user_already_registered"

## Fix Going Forward

The migration script `20251101_cleanup_orphaned_profiles.sql` has been added to help identify and clean up orphaned profiles.

