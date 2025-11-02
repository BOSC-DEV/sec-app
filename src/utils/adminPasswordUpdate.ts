/**
 * Admin utility to update user passwords
 * 
 * This requires Supabase Service Role Key (admin access)
 * Should only be used server-side or in admin tools
 * 
 * Usage:
 * const { success, error } = await updateUserPassword(
 *   'walletAddress',
 *   'base64Signature'
 * );
 */

import { createClient } from '@supabase/supabase-js';

// Get from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Hash signature to 64-char hex password
 */
async function hashToHex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Update user password using admin API
 * 
 * @param walletAddress - User's wallet address
 * @param signature - Base64 signature from wallet
 * @returns Success status and error if any
 */
export async function updateUserPassword(
  walletAddress: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return {
      success: false,
      error: 'Service role key not configured. This function requires admin access.'
    };
  }

  try {
    // Create admin client
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Hash the signature
    const hashedPassword = await hashToHex(signature);
    
    // Find user by email
    const email = `${walletAddress}@sec.digital`;
    
    // List users and find matching one
    const { data, error: listError } = await adminClient.auth.admin.listUsers();
    
    if (listError) {
      return {
        success: false,
        error: `Failed to list users: ${listError.message}`
      };
    }

    const users = data?.users || [];
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Update password
    const { error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
      password: hashedPassword
    });

    if (updateError) {
      return {
        success: false,
        error: `Failed to update password: ${updateError.message}`
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Migrate all legacy users (requires user signatures)
 * This should be called from an admin tool or backend
 */
export async function migrateLegacyUsers(
  userMigrations: Array<{ walletAddress: string; signature: string }>
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const { walletAddress, signature } of userMigrations) {
    const result = await updateUserPassword(walletAddress, signature);
    if (result.success) {
      success++;
    } else {
      failed++;
      errors.push(`${walletAddress}: ${result.error}`);
    }
  }

  return { success, failed, errors };
}

