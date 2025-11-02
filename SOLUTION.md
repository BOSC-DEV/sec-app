# 🎯 The Real Issue

## Problem
The trigger stores wallet address in **mixed case** from `raw_user_meta_data`, but email is **lowercase**. This causes case mismatch in profiles table.

## The Check
Run this in Supabase SQL Editor:

```sql
-- Check what's in profiles table
SELECT 
  id,
  wallet_address,
  LOWER(wallet_address) as wallet_lowercase
FROM public.profiles
WHERE LOWER(wallet_address) LIKE '4a2gepav8%';
```

## The Fix

**Option 1: Update the trigger to always store lowercase**
- Change trigger to store `LOWER(v_wallet_address)`
- This ensures consistency

**Option 2: Delete and recreate everything**
1. Delete user: Authentication → Users
2. Delete profile: SQL Editor → `DELETE FROM profiles WHERE...`
3. Try signup again

**Option 3: Quick fix - Update existing profile**
```sql
-- Update profile to lowercase to match email
UPDATE public.profiles
SET wallet_address = LOWER(wallet_address)
WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';
```

## My Recommendation

**First, run the check query to see what case is stored.**

Then tell me and I'll give you the exact fix!

