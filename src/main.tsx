
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProfileProvider } from './contexts/ProfileContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmcc5mm9q000rkz0m53xmxol6"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#F4C430',
          logo: '/favicon.ico',
        },
        loginMethods: ['wallet', 'email'],
        defaultChain: {
          id: 101, // Solana Mainnet
          name: 'Solana',
          network: 'solana-mainnet',
          nativeCurrency: {
            name: 'SOL',
            symbol: 'SOL',
            decimals: 9,
          },
          rpcUrls: {
            default: {
              http: ['https://api.mainnet-beta.solana.com'],
            },
            public: {
              http: ['https://api.mainnet-beta.solana.com'],
            },
          },
        },
        supportedChains: [{
          id: 101,
          name: 'Solana',
          network: 'solana-mainnet',
          nativeCurrency: {
            name: 'SOL',
            symbol: 'SOL',
            decimals: 9,
          },
          rpcUrls: {
            default: {
              http: ['https://api.mainnet-beta.solana.com'],
            },
            public: {
              http: ['https://api.mainnet-beta.solana.com'],
            },
          },
        }],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <ProfileProvider>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </ProfileProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </PrivyProvider>
  </React.StrictMode>
);
