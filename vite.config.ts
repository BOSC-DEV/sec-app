
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Ensure buffer polyfill is used
      buffer: 'buffer',
    },
  },
  build: {
    rollupOptions: {
      external: [
        'react-helmet',
      ],
    },
  },
  define: {
    // Make Buffer available globally for @solana/web3.js and @solana/spl-token
    global: 'globalThis',
  }
}));
