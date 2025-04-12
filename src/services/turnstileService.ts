
import { toast } from '@/hooks/use-toast';

// Cloudflare Turnstile site key - this is a public key
export const TURNSTILE_SITE_KEY = '1x00000000000000000000AA'; // Replace with your actual site key

/**
 * Verifies a Cloudflare Turnstile token
 * This is a client-side verification that helps prevent form submissions without verification
 * Note: For production, you should also verify the token server-side
 */
export const verifyTurnstileToken = async (token: string): Promise<boolean> => {
  if (!token) {
    toast({
      title: "Verification required",
      description: "Please complete the verification challenge",
      variant: "destructive"
    });
    return false;
  }
  
  try {
    // In a production environment, you would verify this token server-side
    // This is a simple client-side check just to ensure a token exists
    return token.length > 0;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    toast({
      title: "Verification failed",
      description: "Robot verification failed. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
