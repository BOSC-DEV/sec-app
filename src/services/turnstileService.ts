
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
    console.log("Verification failed: No token provided");
    toast({
      title: "Verification required",
      description: "Please complete the verification challenge before submitting",
      variant: "destructive"
    });
    return false;
  }
  
  try {
    // For a real implementation, you'd make a server-side request to verify the token
    // For now, we just check that a token exists and has reasonable length
    const isValid = token.length > 20;
    
    if (!isValid) {
      console.log("Verification failed: Invalid token");
      toast({
        title: "Verification failed",
        description: "Please try completing the verification again",
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Verification successful");
    return true;
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
