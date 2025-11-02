# 🚨 CRITICAL FIX - APPLY THIS ONE FIRST

## The Issue

When creating a new account, you're getting:
- `"permission denied for table users"` 
- `"Invalid login credentials"`

This is because RLS policies query `auth.users` but don't have permission!

## The Fix

**Go to Supabase Dashboard → SQL Editor**

**Copy and paste this EXACT migration:**

```sql
-- Grant SELECT access on auth.users to authenticated role
-- This is required for RLS policies that query auth.users.raw_user_meta_data

GRANT SELECT ON auth.users TO authenticated;
```

**Click RUN.**

## Verify It Worked

After running, test:
1. Delete your user from Supabase Dashboard (Authentication → Users)
2. Try logging in with wallet again
3. Should work now!

---

**After this works, apply the other 4 migrations from `APPLY_FIXES_NOW.md`**

