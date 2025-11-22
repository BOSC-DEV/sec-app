
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
