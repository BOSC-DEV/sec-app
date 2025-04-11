
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

// This component handles syncing the theme with the system preference
const ThemeWatcher = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme');
      // Only auto-switch if user hasn't explicitly chosen a theme
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    return undefined;
  }, [setTheme]);
  
  return <>{children}</>;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <ThemeWatcher>
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </ThemeWatcher>
    </ThemeProvider>
  );
};

export default Layout;
