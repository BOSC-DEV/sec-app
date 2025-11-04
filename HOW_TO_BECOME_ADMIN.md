# How to Become an Admin

There are two ways to become an admin in this system:

## Method 1: Username-Based Admin

Set your username to one of these admin usernames:
- `sec`
- `thesec`

**Steps:**
1. Go to `/profile` page
2. Change your username to `sec` or `thesec`
3. Save your profile
4. You should now have admin access!

**Note:** This is case-insensitive, so `SEC`, `Sec`, etc. will also work.

---

## Method 2: Database Admin Flag

Set the `is_admin` flag directly in the database.

**Steps:**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL query (replace with your wallet address):

```sql
-- Make yourself admin
UPDATE public.profiles
SET is_admin = true
WHERE wallet_address = 'YOUR_WALLET_ADDRESS_HERE';
```

3. Refresh the browser
4. You should now have admin access!

---

## Verifying Admin Access

After making yourself admin:
1. Go to `/admin-dashboard` (should be accessible)
2. You should see admin features like:
   - User management (ban/suspend users)
   - Report review
   - Announcement management
   - Edit/delete live chat messages
   - Survey management

---

## Current System

The system checks both:
1. **Hardcoded usernames** in `src/utils/adminUtils.ts`: `['sec', 'thesec']`
2. **Database flag** `profiles.is_admin`

If either condition is true, you have admin access!

