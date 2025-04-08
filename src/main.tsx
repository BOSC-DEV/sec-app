
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Buffer polyfill for Solana web3.js and spl-token
import { Buffer } from 'buffer';
// Make Buffer available globally
window.Buffer = Buffer;

// Make sure global is defined for Solana libraries
if (typeof window !== 'undefined') {
  // Define global as window for browser environments
  window.global = window;
}

createRoot(document.getElementById("root")!).render(<App />);
