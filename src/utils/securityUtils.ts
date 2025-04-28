
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
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '');
  
  // Replace potentially dangerous attributes
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/\bon\w+\s*=/gi, '') // More robust way to catch all event handlers
    .replace(/data:/gi, '')
    .replace(/blob:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/livescript:/gi, '')
    .replace(/mocha:/gi, '')
    .replace(/eval\s*\(/gi, '')
    .replace(/expression\s*\(/gi, '');
    
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
    // Remove any leading/trailing whitespace
    url = url.trim();
    
    // Check if URL is valid
    const parsedUrl = new URL(url);
    
    // Only allow certain protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    
    // Additional safety checks for URL
    const dangerousDomains = [
      'evil.com', 'attacker.net', 'malware.org',
      'phishing', 'malicious', 'xss', 'csrf',
      'hack', 'exploit', 'attack'
    ];
    
    if (dangerousDomains.some(domain => parsedUrl.hostname.toLowerCase().includes(domain))) {
      return '';
    }
    
    // Check for IP addresses in hostname (potential for bypassing domain blocks)
    const ipAddressPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (ipAddressPattern.test(parsedUrl.hostname)) {
      // Further validate legitimate IP usage if needed
      // For now, we'll block direct IP navigation as it's often used to bypass security
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
  
  // More comprehensive email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Check length constraints
  if (email.length > 320) return false; // Max email length
  
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
    .replace(/\*\//g, '') // Remove block comment end
    .replace(/xp_/gi, '') // SQL Server extended stored procedures
    .replace(/exec\s+/gi, '') // Remove exec command
    .replace(/union\s+select/gi, ''); // Remove UNION SELECT pattern
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
      image: ['localhost', 'lovable.app', 'yscammm.io', 'github.com', 'githubusercontent.com', 'mfirlsuuxpvgwaxymjor.supabase.co'],
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
    
    // Recursively sanitize string values in the JSON object
    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
      }
      
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          result[key] = sanitizeHtml(value);
        } else if (typeof value === 'object' && value !== null) {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }
      
      return result;
    };
    
    return JSON.stringify(sanitizeObject(parsed));
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
  
  // Additional security check - ensure address doesn't contain suspicious patterns
  const containsSuspiciousPattern = /script|javascript|eval|function/i.test(address);
  
  return solanaRegex.test(address) && !containsSuspiciousPattern;
};

/**
 * Creates secure content security policy headers
 * @returns CSP header string
 */
export const getContentSecurityPolicy = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'", // Allow inline styles for now
    "img-src 'self' data: https://mfirlsuuxpvgwaxymjor.supabase.co",
    "font-src 'self'",
    "connect-src 'self' https://mfirlsuuxpvgwaxymjor.supabase.co",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
};

/**
 * Creates security headers for responses
 * @returns Record of security headers
 */
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': getContentSecurityPolicy(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
};

/**
 * Detects potentially malicious input patterns
 * @param input - The string to check
 * @returns Boolean indicating if the input seems malicious
 */
export const detectMaliciousPattern = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /eval\(/i,
    /document\.cookie/i,
    /localStorage/i,
    /sessionStorage/i,
    /fetch\(/i,
    /XMLHttpRequest/i
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Validates and sanitizes form inputs
 * @param formData - The object containing form data
 * @returns Sanitized form data object
 */
export const sanitizeFormData = (formData: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    
    if (typeof value === 'string') {
      result[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeFormData(value);
    } else {
      result[key] = value;
    }
  });
  
  return result;
};
