
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Toggle } from '@/components/ui/toggle';

const ThemeToggle: React.FC<{
  variant?: 'default' | 'outline' | 'gold';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}> = ({ variant = 'outline', size = 'sm', className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`flex items-center justify-center ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4 text-icc-blue" /> // Added text-icc-blue for better visibility in light mode
      )}
    </Button>
  );
};

export default ThemeToggle;
