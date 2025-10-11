import { useContext } from 'react';

import { ThemeContext } from '@/contexts/ThemeContext';

export type { Theme } from '@/contexts/ThemeContext';

interface UseThemeReturn {
  theme: 'light' | 'dark' | null;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
