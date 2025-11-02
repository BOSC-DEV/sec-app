# Fix: Create Profile Button Not Working

## Problem

When a user logs in with Phantom wallet but has no profile yet, clicking "Create Profile" on the `/profile` page did nothing. The console logs showed:

```
ProfileContext.tsx:97 Fetched profile: null
```

But clicking "Create Profile" had no effect.

## Root Cause

The `onSubmit` function in `ProfilePage.tsx` had a guard clause:
```typescript
if (!walletAddress || !profile) return;
```

When `profile` was `null` (for new users), the function would return immediately without doing anything.

Additionally, the `saveProfile` function in `profileService.ts` was trying to upsert profiles with an empty `id` string, which would cause database errors.

## Solution

### 1. Fixed ProfilePage.tsx (lines 118-160)

Changed the `onSubmit` function to create a base profile object when none exists:

```typescript
const onSubmit = async (data: ProfileFormValues) => {
  if (!walletAddress) return;
  try {
    setIsSaving(true);
    
    // Create base profile if it doesn't exist
    const baseProfile = profile || {
      id: '',
      wallet_address: walletAddress,
      display_name: '',
      username: '',
      profile_pic_url: '',
      created_at: new Date().toISOString(),
      x_link: '',
      website_link: '',
      bio: '',
      points: 0
    };
    
    const updatedProfile = await updateProfile({
      ...baseProfile,
      display_name: data.display_name,
      username: data.username,
      bio: data.bio,
      x_link: data.x_link,
      website_link: data.website_link,
      profile_pic_url: avatarUrl || baseProfile.profile_pic_url
    });
    
    if (data.username && updatedProfile) {
      navigate(`/${data.username}?t=${Date.now()}`);
    }
  } catch (error) {
    // ... error handling
  }
};
```

Key change: Removed the `!profile` check and instead create a base profile with empty values.

### 2. Fixed profileService.ts (lines 204-222)

Changed the upsert logic to handle new profiles correctly:

```typescript
// Call the existing upsert function in Supabase
// For new profiles, omit id and let it be auto-generated
const { id, ...profileWithoutId } = updatedProfile;
const upsertData: any = {
  ...profileWithoutId,
  wallet_address: profile.wallet_address
};

// Only include id if it's a valid UUID (existing profile)
if (id && id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
  upsertData.id = id;
}

const { data, error } = await supabase
  .from('profiles')
  .upsert(upsertData, { onConflict: 'wallet_address' })
  .select()
  .single();
```

Key changes:
1. Destructure `id` out of `updatedProfile` to completely omit it from the spread
2. Only add `id` back if it's a valid UUID (existing profile)
3. Use `onConflict: 'wallet_address'` to properly handle upserts by wallet address
4. Let Supabase auto-generate the `id` for new profiles

## Database Behavior

The profiles table has a trigger `enforce_profile_constraints` that:
- Trims whitespace from fields
- Converts empty strings to NULL for optional fields
- Validates usernames (3-32 chars, alphanumeric + underscore)
- Checks display name length (1-50 chars)

So empty strings passed from the client will be properly normalized by the database.

## Testing

To test this fix:

1. Log in with a Phantom wallet that doesn't have a profile yet
2. Navigate to `/profile`
3. Fill in the form with:
   - Display name
   - Username (3-32 chars, alphanumeric + underscore)
   - Bio (optional)
   - Social links (optional)
4. Click "Create Profile"
5. Should navigate to `/{username}` after successful save

## Files Modified

- `src/pages/ProfilePage.tsx` - Added base profile creation logic
- `src/services/profileService.ts` - Fixed upsert to handle new profiles

## Initial Test Result

First attempt had an issue:
```
Error: invalid input syntax for type uuid: ""
```

This was because `id: ''` was being included in the upsert even after the UUID check. Fixed by destructuring `id` out first, then only adding it back if it's a valid UUID.

## Status

✅ Fixed and ready to test

