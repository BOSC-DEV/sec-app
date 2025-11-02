# Fix: UUID vs Wallet Address Mismatch

## Problem

After successfully fixing the profile creation flow, new errors appeared when viewing a profile:

```
Error: invalid input syntax for type uuid: "4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W"
```

Multiple queries were using `wallet_address` (text) where UUID fields were expected.

## Root Cause

Several database fields were changed from `wallet_address` to UUID references to `profiles(id)`, but the code was still passing `wallet_address` values instead of `profile.id`.

## Changes Made

### 1. PublicProfilePage.tsx (lines 68-87)

Changed three useQuery hooks to use `profile.id` instead of `profile.wallet_address`:

- `getUserBountyContributions` - queries bounty_contributions by contributor_id
- `getScammersByReporter` - queries scammers by added_by  
- `getLikedScammersByUser` - queries user_scammer_interactions by user_id

### 2. scammerService.ts (lines 124-207)

Updated function signatures to accept `userId` instead of `walletAddress`:

- `getScammersByReporter` - now uses profile.id for added_by field
- `getLikedScammersByUser` - now uses profile.id for user_id field

## Database Schema

The following fields reference `profiles(id)` as UUID:

- `scammers.added_by` → UUID references profiles(id)
- `bounty_contributions.contributor_id` → UUID references profiles(id)
- `user_scammer_interactions.user_id` → UUID references profiles(id)

## Files Modified

- `src/pages/PublicProfilePage.tsx` - Use profile.id instead of profile.wallet_address
- `src/services/scammerService.ts` - Update function parameters and queries

## Status

✅ All UUID/wallet address mismatches fixed
✅ No linting errors
✅ Ready to test

## Testing

After these changes, viewing a user profile should no longer show UUID syntax errors for:
- Bounty contributions
- Reported scammers
- Liked scammers

