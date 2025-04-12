import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';

// Cloudflare Turnstile site key - replace with your actual production site key
export const TURNSTILE_SITE_KEY = 'YOUR_ACTUAL_PRODUCTION_SITE_KEY'; // Update this with your real site key

/**
 * Verifies a Cloudflare Turnstile token
 * This performs both client-side and server-side verification
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
    // Get client IP hash for rate limiting
    // In a real implementation, you would generate this more securely
    const ipHash = `client-${new Date().getTime()}`;
    
    // Call the Supabase Edge Function for server-side verification
    const { data, error } = await supabase.functions.invoke('verify-turnstile', {
      body: {
        token,
        ip_address: ipHash
      }
    });
    
    if (error) {
      console.error("Turnstile verification request failed:", error);
      toast({
        title: "Verification failed",
        description: "Unable to verify your human status. Please try again.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!data.success) {
      console.error("Turnstile verification failed:", data.error);
      toast({
        title: "Verification failed",
        description: "Robot verification failed. Please try again.",
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Turnstile verification successful", data);
    return true;
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Verification system error. Please try again later.",
      severity: ErrorSeverity.MEDIUM,
      context: "turnstile_verification"
    });
    return false;
  }
};

/**
 * Submits a report with rate limiting and verification
 */
export const submitReportWithVerification = async (reportData: any, token: string, userId?: string): Promise<boolean> => {
  if (!token) {
    toast({
      title: "Verification required",
      description: "Please complete the verification challenge before submitting",
      variant: "destructive"
    });
    return false;
  }
  
  try {
    // Get a client IP hash for rate limiting
    // In a real implementation, you would generate this more securely
    const ipHash = `client-${new Date().getTime()}`;
    
    // Call the Supabase Edge Function for rate-limited report submission
    const { data, error } = await supabase.functions.invoke('submit-report', {
      body: {
        token,
        ip_hash: ipHash,
        report_data: reportData,
        user_id: userId
      }
    });
    
    if (error) {
      console.error("Report submission failed:", error);
      toast({
        title: "Submission failed",
        description: error.message || "Unable to submit your report. Please try again.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!data.success) {
      // Check for rate limiting errors specifically
      if (error?.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: data.error || "You've submitted too many reports recently. Please try again later.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Submission failed",
          description: data.error || "Unable to submit your report. Please try again.",
          variant: "destructive"
        });
      }
      return false;
    }
    
    return true;
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to submit report. Please try again later.",
      severity: ErrorSeverity.HIGH,
      context: "report_submission"
    });
    return false;
  }
};
