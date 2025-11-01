/**
 * Migration script to fix legacy user passwords
 * 
 * This script updates users who signed up with base64 signatures (>72 chars)
 * to the new hashed password format (64-char hex)
 * 
 * Requirements:
 * - Supabase Service Role Key (admin access)
 * - Node.js runtime
 * 
 * Usage:
 * 1. Set environment variables:
 *    SUPABASE_URL=your_supabase_url
 *    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 * 
 * 2. Run: npx tsx scripts/migrate-legacy-users.ts
 * 
 * NOTE: Users will need to sign in again after migration
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Hash a string to SHA-256 hex (64 characters)
 */
async function hashToHex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a migration signature message
 * Users will need to sign this with their wallet
 */
function generateMigrationMessage(walletAddress: string, timestamp: number): string {
  return `Migrate password for ${walletAddress} at ${timestamp}`;
}

async function migrateUsers() {
  console.log('Starting user password migration...\n');

  try {
    // List all users
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    console.log(`Found ${users.length} users\n`);

    // Filter users with @sec.digital email
    const secUsers = users.filter(user => 
      user.email?.endsWith('@sec.digital')
    );

    console.log(`Found ${secUsers.length} SEC users\n`);

    if (secUsers.length === 0) {
      console.log('No users to migrate');
      return;
    }

    // Process each user
    let migrated = 0;
    let failed = 0;

    for (const user of secUsers) {
      const walletAddress = user.email?.split('@')[0] || '';
      
      if (!walletAddress) {
        console.log(`⚠️  Skipping user ${user.id} - invalid email`);
        continue;
      }

      console.log(`Processing: ${walletAddress}`);

      // For each user, you need to:
      // 1. Request a new signature from the user (via frontend)
      // 2. Hash the signature
      // 3. Update their password
      
      // For now, this script just identifies users that need migration
      // The actual password update requires a signature from the user
      
      // To update password programmatically:
      // 1. User signs message via wallet (frontend)
      // 2. Send signature to backend/admin endpoint
      // 3. Hash signature: const hashed = await hashToHex(signature)
      // 4. Update: await adminClient.auth.admin.updateUserById(user.id, { password: hashed })
      
      console.log(`  ✅ User identified: ${walletAddress}`);
      
      // Example update (requires user's signature):
      // const timestamp = Date.now();
      // const message = generateMigrationMessage(walletAddress, timestamp);
      // const signature = await getUserSignature(walletAddress, message); // Get from frontend
      // const hashedPassword = await hashToHex(signature);
      // 
      // const { error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
      //   password: hashedPassword
      // });
      // 
      // if (updateError) {
      //   console.error(`  ❌ Error updating: ${updateError.message}`);
      //   failed++;
      // } else {
      //   console.log(`  ✅ Password updated`);
      //   migrated++;
      // }
    }

    console.log(`\n✅ Migration complete`);
    console.log(`   Migrated: ${migrated}`);
    console.log(`   Failed: ${failed}`);
    
    console.log(`\n⚠️  NOTE: This script only identifies users that need migration.`);
    console.log(`   Actual password updates require user signatures via wallet.`);
    console.log(`   Implement a frontend flow where users sign a message, then update their password.`);

  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Quick fix: Delete user's auth account so they can sign up fresh
// WARNING: This will delete the user's auth session and require re-signup
async function resetUserPassword(userId: string, newPassword: string) {
  try {
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      password: newPassword
    });
    
    if (error) {
      console.error(`Failed to reset password for ${userId}:`, error);
      return false;
    }
    
    console.log(`✅ Password reset for ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error resetting password:`, error);
    return false;
  }
}

// Run migration
if (require.main === module) {
  migrateUsers().catch(console.error);
}

export { migrateUsers, resetUserPassword, hashToHex, generateMigrationMessage };

