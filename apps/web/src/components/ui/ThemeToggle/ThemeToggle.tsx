import { memo } from 'react';

import { ThemeToggleUI } from '@/components/ui/ThemeToggle/ThemeToggleUI';
import { useThemeToggle } from '@/components/ui/ThemeToggle/useThemeToggle';

interface ThemeToggleProps {
  ref?: React.Ref<HTMLButtonElement>;
}

export const ThemeToggle = memo(({ ref }: ThemeToggleProps) => {
  const themeToggle = useThemeToggle();

  return (
    <ThemeToggleUI
      ref={ref}
      onToggle={themeToggle.handleToggle}
      theme={themeToggle.theme}
      ariaLabel={themeToggle.ariaLabel}
    />
  );
});

ThemeToggle.displayName = 'ThemeToggle';
