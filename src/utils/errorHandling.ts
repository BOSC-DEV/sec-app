
import { toast } from "@/hooks/use-toast";
import analyticsService from "@/services/analyticsService";
import { sanitizeHtml, sanitizeInput } from "./securityUtils";

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',      // Minor UI glitches, non-critical features
  MEDIUM = 'medium', // Important but not critical features
  HIGH = 'high',     // Critical path features, authentication
  CRITICAL = 'critical' // Application-breaking errors
}

interface ErrorHandlingOptions {
  fallbackMessage?: string;
  severity?: ErrorSeverity;
  context?: string;
  silent?: boolean;
  retry?: () => Promise<any>;
  onError?: (error: unknown) => void;
}

/**
 * Centralized error handling function
 * Handles logging, user notification, and error reporting
 */
export const handleError = (
  error: unknown, 
  fallbackMessageOrOptions: string | ErrorHandlingOptions = "An error occurred"
): void => {
  // Normalize options
  const options: ErrorHandlingOptions = typeof fallbackMessageOrOptions === 'string' 
    ? { fallbackMessage: fallbackMessageOrOptions }
    : fallbackMessageOrOptions;
  
  const { 
    fallbackMessage = "An error occurred", 
    severity = ErrorSeverity.MEDIUM,
    context,
    silent = false,
    onError
  } = options;
  
  // Always log to console
  console.error(`[${severity.toUpperCase()}] ${context ? `[${context}] ` : ''}Error:`, error);
  
  // Extract error message
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = String((error as { message: unknown }).message);
  }
  
  // Sanitize error message before displaying to user
  // This prevents potential XSS via error messages
  errorMessage = sanitizeHtml(errorMessage);
  
  // Track error in analytics
  analyticsService.trackError(
    error instanceof Error ? error : new Error(errorMessage),
    context
  );
  
  // Show toast notification unless silent is true
  if (!silent) {
    toast({
      title: severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL 
        ? "Error" 
        : "Warning",
      description: errorMessage,
      variant: severity === ErrorSeverity.LOW ? "default" : "destructive",
    });
  }
  
  // Call custom error handler if provided
  if (onError) {
    onError(error);
  }
};

/**
 * Utility function to safely parse JSON with security precautions
 */
export const safeParse = <T>(jsonString: string, fallback: T): T => {
  try {
    // Sanitize the JSON string before parsing
    const sanitizedJson = sanitizeInput(jsonString);
    return JSON.parse(sanitizedJson) as T;
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to parse data",
      severity: ErrorSeverity.MEDIUM,
      context: "JSON_PARSE"
    });
    return fallback;
  }
};

// Async error wrapper - allows for cleaner async/await error handling
export const asyncErrorWrapper = async <T>(
  promise: Promise<T>,
  options: ErrorHandlingOptions = {}
): Promise<T | null> => {
  try {
    return await promise;
  } catch (error) {
    handleError(error, options);
    return null;
  }
};

// Retry operation with exponential backoff
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    initialDelay = 300,
    maxDelay = 5000,
    backoffFactor = 2,
    onRetry
  } = options;
  
  let attempt = 0;
  let lastError: unknown;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      attempt++;
      
      if (onRetry) {
        onRetry(attempt, error);
      }
      
      if (attempt >= maxRetries) {
        break;
      }
      
      const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
