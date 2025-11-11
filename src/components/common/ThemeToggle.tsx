
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC<{
  variant?: 'default' | 'outline' | 'gold' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}> = ({ variant = 'ghost', size = 'icon', className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className={`text-gray-300 hover:text-gray-100 bg-transparent border-none ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
