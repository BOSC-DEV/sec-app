
/**
 * Polyfills required for Solana web3.js and SPL token libraries in browser environments
 * This file MUST be imported before any Solana-related code
 */

// Buffer polyfill
import { Buffer as BufferPolyfill } from 'buffer';

// Make Buffer available globally
window.Buffer = BufferPolyfill;

// Ensure all required global objects are available
if (typeof window !== 'undefined') {
  // Define global as window for browser environments
  window.global = window;
  
  // Additional required polyfills for Solana libraries
  if (!window.process) {
    window.process = {
      env: {},
      version: '',
      // Add any other process properties needed
    } as any;
  }
  
  // Ensure crypto is available (may be needed in some cases)
  if (!window.crypto) {
    console.warn('Window.crypto is not available. Some Solana features may not work correctly.');
  }
}

// Export Buffer for explicit imports if needed
export { BufferPolyfill as Buffer };
