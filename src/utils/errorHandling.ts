
import { toast } from "@/hooks/use-toast";
import analyticsService from "@/services/analyticsService";
import log from "@/services/loggingService";
import { sanitizeHtml, sanitizeInput } from "./securityUtils";
import { ErrorSeverity } from "./errorSeverity";

// Re-export ErrorSeverity so existing imports continue to work
export { ErrorSeverity };

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
  
  // Extract error message
  let errorMessage = fallbackMessage;
  let errorObject: Error;
  
  if (error instanceof Error) {
    errorMessage = error.message;
    errorObject = error;
  } else if (typeof error === 'string') {
    errorMessage = error;
    errorObject = new Error(error);
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = String((error as { message: unknown }).message);
    errorObject = new Error(errorMessage);
    if ('stack' in error) {
      errorObject.stack = String((error as { stack: unknown }).stack);
    }
  } else {
    errorObject = new Error(fallbackMessage);
  }
  
  // Sanitize error message before displaying to user
  // This prevents potential XSS via error messages
  errorMessage = sanitizeHtml(errorMessage);
  
  // Log the error using our enhanced logging service
  log.fromSeverity(
    severity,
    errorMessage,
    errorObject,
    context,
    { originalError: error }
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
