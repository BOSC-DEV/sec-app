
// Import polyfills first, before anything else
import './utils/solana-polyfills';

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
