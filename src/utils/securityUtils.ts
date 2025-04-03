
/**
 * Security utility functions for the application
 * Handles input sanitization, XSS prevention, and other security measures
 */

/**
 * Sanitizes HTML strings to prevent XSS attacks
 * Removes potentially dangerous tags and attributes
 * 
 * @param input - The string to sanitize
 * @returns A sanitized version of the input string
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // Replace potentially dangerous HTML tags
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Replace potentially dangerous attributes
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '');
    
  return sanitized;
};

/**
 * Validates and sanitizes a URL
 * @param url - The URL to validate and sanitize
 * @returns A sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Check if URL is valid
    const parsedUrl = new URL(url);
    
    // Only allow certain protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    
    return url;
  } catch (e) {
    // If URL is not valid, return empty string
    return '';
  }
};

/**
 * Validates an email address format
 * @param email - The email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Sanitizes user input for database queries
 * @param input - The user input to sanitize
 * @returns Sanitized input string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Replace SQL injection patterns
  return input
    .replace(/'/g, "''")  // Escape single quotes
    .replace(/;/g, '');   // Remove semicolons
};

/**
 * Enforces content security for dynamically loaded resources
 * @param url - The URL to verify
 * @param type - The type of resource (image, script, etc.)
 * @returns Boolean indicating if resource should be allowed
 */
export const isAllowedResource = (url: string, type: 'image' | 'script' | 'style' | 'frame'): boolean => {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    
    // Define allowed domains for different resource types
    const allowedDomains: Record<string, string[]> = {
      image: ['localhost', 'lovable.app', 'yscammm.io'],
      script: ['localhost', 'lovable.app', 'yscammm.io'],
      style: ['localhost', 'lovable.app', 'yscammm.io'],
      frame: ['localhost', 'lovable.app', 'yscammm.io'],
    };
    
    return allowedDomains[type].some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch (e) {
    return false;
  }
};
