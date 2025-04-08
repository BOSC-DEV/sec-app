
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Buffer polyfill for Solana web3.js
import { Buffer } from 'buffer';
window.Buffer = Buffer;
// Make sure global is defined for Solana web3.js
if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
}

createRoot(document.getElementById("root")!).render(<App />);
