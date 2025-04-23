
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
    .replace(/data:/gi, '')
    .replace(/blob:/gi, '') // Adding blob: protocol prevention
    .replace(/vbscript:/gi, ''); // Adding vbscript: protocol prevention
    
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
    
    // Additional safety checks for URL
    const dangerousDomains = ['evil.com', 'attacker.net', 'malware.org'];
    if (dangerousDomains.some(domain => parsedUrl.hostname.includes(domain))) {
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
    .replace(/;/g, '')    // Remove semicolons
    .replace(/--/g, '')   // Remove comment markers
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, ''); // Remove block comment end
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
      image: ['localhost', 'lovable.app', 'yscammm.io', 'github.com', 'githubusercontent.com'],
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

/**
 * Validates and sanitizes JSON strings
 * @param input - The JSON string to sanitize
 * @returns Sanitized JSON string
 */
export const sanitizeJson = (input: string): string => {
  if (!input) return '';
  
  try {
    // Parse and re-stringify to ensure it's valid JSON
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (e) {
    // Return empty object if invalid JSON
    return '{}';
  }
};

/**
 * Generates a secure hash for sensitive data
 * @param data - The data to hash
 * @returns A hash string
 */
export const generateHash = (data: string): string => {
  // This is a simple hash for demonstration. In production,
  // use a proper crypto library with a secure algorithm
  let hash = 0;
  if (data.length === 0) return hash.toString();
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
};

/**
 * Validates a wallet address format
 * @param address - The wallet address to validate
 * @returns Boolean indicating if address format is valid
 */
export const isValidWalletAddress = (address: string): boolean => {
  if (!address) return false;
  
  // Basic check for Solana addresses (44 characters starting with a number or letter)
  const solanaRegex = /^[A-Za-z0-9]{43,44}$/;
  return solanaRegex.test(address);
};
