
import React, { ReactElement } from 'react';
import { render as testingLibraryRender, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { HelmetProvider } from 'react-helmet-async';
import { vi } from 'vitest';

// Import screen and fireEvent directly from testing-library/react
import { screen, fireEvent } from '@testing-library/react';

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
) => testingLibraryRender(ui, { wrapper: AllTheProviders, ...options });

// Mock form field with validation
const mockFormField = (name: string, value: any, type = 'text') => {
  return {
    name,
    value,
    type,
    onChange: vi.fn(),
    onBlur: vi.fn(),
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
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Mock Supabase client
const mockSupabaseClient = () => {
  const data = {}; // Store mock data here
  
  return {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    then: vi.fn(cb => Promise.resolve(cb({ data: [], error: null }))),
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn(),
      session: vi.fn(),
      user: { id: 'mock-user-id' },
    },
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
    },
  };
};

// Export all test utilities
export { customRender as render, screen, fireEvent, mockFormField, mockApiResponse, mockApiError, mockLocalStorage, mockSupabaseClient };
