# 🚨 APPLY THESE FIXES NOW - Step by Step

## The Problems

1. ❌ Users can't log in (password mismatch)
2. ❌ Can't update profile (permission denied)
3. ❌ UUID type errors in logs

## The Solution

Run these 4 SQL migrations in Supabase Dashboard:

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com/
2. Select your project
3. Click **SQL Editor** in left sidebar

### Step 2: Run Migration 1 (Auto-create Profiles)
Copy entire contents of: `supabase/migrations/20251101_auto_create_profile_trigger.sql`

Paste into SQL Editor and click **Run**.

**Verify:** Should see "Success. No rows returned"

### Step 3: Run Migration 2 (Fix Profile Permissions) ⚠️ CRITICAL
Copy entire contents of: `supabase/migrations/20251101_fix_profiles_rls_policies.sql`

Paste into SQL Editor and click **Run**.

**Verify:** Should see "Success. No rows returned"

### Step 4: Run Migration 3 (Fix All RLS Errors)
Copy entire contents of: `supabase/migrations/20251101_fix_reactions_rls_policies.sql`

Paste into SQL Editor and click **Run**.

**Verify:** Should see "Success. No rows returned"

### Step 5: Run Migration 4 (Add Notification Actor Columns)
Copy entire contents of: `supabase/migrations/20251101_add_notification_actor_columns.sql`

Paste into SQL Editor and click **Run**.

**Verify:** Should see "Success. No rows returned"

---

## Quick Test

After all migrations:

1. ✅ **Log out** of the app
2. ✅ **Log back in** with wallet
3. ✅ **Try updating your profile**
4. ✅ **Check logs** - no more UUID errors!

---

## What These Fix

| Migration | Problem | Fix |
|-----------|---------|-----|
| 1. Auto-create trigger | No profile on signup | Creates profile automatically |
| 2. **Profiles RLS** | **Can't update profile** | **Fixes permission denied** |
| 3. Reactions RLS | UUID type errors | Fixes all RLS policies |
| 4. **Actor columns** | **Missing notification fields** | **Adds actor columns** |

---

## Still Having Issues?

Check these in Supabase Dashboard:

1. **Authentication → Settings**
   - Email confirmation: **DISABLED** ✅
   - Phone sign-in: **DISABLED** ✅

2. **Database → SQL Editor**
   - Run this query to check trigger:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
   - Should return 1 row

3. **Database → Policies**
   - Click `profiles` table
   - Should see 3 policies:
     - Profiles are viewable by everyone
     - Users can update own profile
     - Users can insert own profile

---

## Done! 🎉

Your app should now work perfectly:
- ✅ Login works for all users
- ✅ Profile updates work
- ✅ No more errors

