import { useCallback, useMemo } from 'react';

import { useTheme, type Theme } from '@/hooks/useTheme';

interface UseThemeToggleReturn {
  theme: Theme;
  handleToggle: () => void;
  ariaLabel: string;
}

export const useThemeToggle = (): UseThemeToggleReturn => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const ariaLabel = useMemo(
    () => `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
    [theme]
  );

  return {
    theme,
    handleToggle,
    ariaLabel,
  };
};
