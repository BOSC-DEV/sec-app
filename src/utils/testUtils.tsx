
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { HelmetProvider } from 'react-helmet-async';

// Create a wrapper with all providers needed for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  // Create a new QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries during testing
        retry: false,
        // Don't refetch on window focus during testing
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProfileProvider>
          <HelmetProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </HelmetProvider>
        </ProfileProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Custom render method with providers included
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock form field with validation
const mockFormField = (name: string, value: any, type = 'text') => {
  return {
    name,
    value,
    type,
    onChange: jest.fn(),
    onBlur: jest.fn(),
  };
};

// Mock API response with delay
const mockApiResponse = <T,>(data: T, delay = 100): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock API error
const mockApiError = (message: string, status = 500, delay = 100): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message);
      (error as any).status = status;
      reject(error);
    }, delay);
  });
};

// Mock local storage
const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Mock Supabase client
const mockSupabaseClient = () => {
  const data = {}; // Store mock data here
  
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    then: jest.fn(cb => Promise.resolve(cb({ data: [], error: null }))),
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      session: jest.fn(),
      user: { id: 'mock-user-id' },
    },
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
    },
  };
};

// Export all test utilities
export * from '@testing-library/react';
export { customRender as render, mockFormField, mockApiResponse, mockApiError, mockLocalStorage, mockSupabaseClient };
