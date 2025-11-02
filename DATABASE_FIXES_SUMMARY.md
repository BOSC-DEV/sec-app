# 🛠️ Database & Authentication Fixes Summary

## Issues Fixed

### 1. ❌ Password Authentication Issues
**Problem:** Users with old password format (base64) couldn't log in after password hashing fix.

**Solution:** Added automatic backward compatibility in `src/utils/authUtils.ts`:
- App tries new hashed password first (SHA-256 hex, 64 chars)
- Falls back to legacy base64 format automatically
- Auto-migrates passwords if service role key is available
- No manual intervention needed

### 2. ❌ Profile Auto-Creation Missing
**Problem:** New users signing up weren't getting profiles created automatically.

**Solution:** Added auth trigger in `supabase/migrations/20251101_auto_create_profile_trigger.sql`:
- Automatically creates profile when user signs up
- Extracts wallet address from email or metadata
- Validates Solana address format
- Handles duplicate profiles gracefully

### 3. ❌ Profile Update Permissions Broken
**Problem:** Multiple conflicting RLS policies on `profiles` table causing "permission denied" errors.

**Solution:** Consolidated all profile policies in `supabase/migrations/20251101_fix_profiles_rls_policies.sql`:
- Dropped all old conflicting policies
- Created single correct UPDATE policy by wallet_address
- Created single correct INSERT policy by wallet_address

### 4. ❌ Notification Actor Columns Missing
**Problem:** Notifications table missing actor columns, causing queries to fail.

**Solution:** Added migration `20251101_add_notification_actor_columns.sql`:
- Added `actor_id`, `actor_name`, `actor_username`, `actor_profile_pic`
- Fixed getAllUserIds to return profile.id instead of wallet_address
- Fixed all notification queries to use profile.id

### 5. ❌ RLS Policy Type Errors
**Problem:** Old RLS policies used `auth.uid()::text = user_id` which caused type mismatches.

**Solution:** Fixed all incorrect policies in `supabase/migrations/20251101_fix_reactions_rls_policies.sql`:
- Fixed `scammers` table policies
- Fixed `user_scammer_interactions` policies
- Fixed `announcement_reactions` policies
- Fixed `reply_reactions` policies
- Fixed `chat_message_reactions` policies
- Fixed `comments` table policies

**How:** Now properly resolve `profiles.id` from `wallet_address` using subquery pattern:
```sql
user_id = (
  SELECT id FROM public.profiles 
  WHERE wallet_address = (
    SELECT raw_user_meta_data->>'wallet_address' 
    FROM auth.users 
    WHERE id = auth.uid()
  )
)
```

## Migrations Created

1. `20251101_auto_create_profile_trigger.sql` - Auto-create profiles on signup
2. `20251101_fix_reactions_rls_policies.sql` - Fix all RLS type errors
3. `20251101_fix_profiles_rls_policies.sql` - Fix profiles UPDATE/INSERT permissions ⚠️
4. `20251101_add_notification_actor_columns.sql` - Add missing notification columns ⚠️
5. `20251101_cleanup_orphaned_profiles.sql` - Cleanup script (already existed)
6. `20251101_migrate_user_passwords.sql` - Password migration helper (already existed)

## Files Modified

1. `src/utils/authUtils.ts` - Added dual password format support
2. `src/services/notificationService.ts` - Fixed getAllUserIds to return profile.id
3. `src/components/notifications/NotificationIndicator.tsx` - Use profile.id instead of wallet_address
4. `src/components/notifications/NotificationDropdown.tsx` - Use profile.id instead of wallet_address
5. `src/pages/NotificationsPage.tsx` - Use profile.id instead of wallet_address
6. `QUICK_FIX_NOW.md` - Updated documentation
7. `DATABASE_FIXES_SUMMARY.md` - This file (new)
8. `APPLY_FIXES_NOW.md` - Step-by-step guide (new)

## Testing Required

After applying migrations, test:

1. ✅ New user signup creates profile automatically
2. ✅ Legacy users can log in with old password format
3. ✅ New users can log in with new password format
4. ✅ Profiles accessible in all tables
5. ✅ RLS policies work correctly for all operations
6. ✅ No type casting errors in logs
7. ✅ **Profile updates work correctly** (CRITICAL FIX)

## Next Steps

**To apply these fixes:**

1. **Open Supabase Dashboard** → SQL Editor
2. Copy and run these migrations in order:
   - `20251101_auto_create_profile_trigger.sql`
   - `20251101_fix_profiles_rls_policies.sql` (CRITICAL!)
   - `20251101_add_notification_actor_columns.sql` (CRITICAL!)
   - `20251101_fix_reactions_rls_policies.sql`
3. Test with a legacy user account
4. Test with a new user signup
5. Test profile updates
6. Monitor logs for any remaining errors

**Critical Migration:** `20251101_fix_profiles_rls_policies.sql` fixes the "permission denied" error when updating profiles.

**If still seeing errors:**

- Check that email confirmation is disabled in Supabase
- Verify service role key is set (optional, for password migration)
- Check that trigger was created successfully
- Verify RLS policies were updated correctly
- Make sure you ran `20251101_fix_profiles_rls_policies.sql`

## Notes

- All changes are backward compatible
- No data loss expected
- Trigger will only work for users who sign up after migration is applied
- Existing orphaned profiles can be cleaned up using cleanup script
- **Profile updates were broken due to conflicting RLS policies** - now fixed!

