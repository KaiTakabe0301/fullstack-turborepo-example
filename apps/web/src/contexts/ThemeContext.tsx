'use client';

import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  memo,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = memo(({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme | null>(null);

  // クライアントマウント時にDOMの実際の値を読み取ってReact状態と同期
  // これにより、_document.tsxのthemeScriptでOSから取得した値を反映できる
  useEffect(() => {
    // data-theme属性から実際のテーマを取得
    // これにより、サーバーとクライアントで異なるテーマが設定される問題を防ぐ
    const actualTheme = document.documentElement.getAttribute('data-theme');
    if (actualTheme && (actualTheme === 'light' || actualTheme === 'dark')) {
      setThemeState(actualTheme);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);

    // クライアントサイドでのみlocalStorageとdata-theme属性を更新
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
});

ThemeProvider.displayName = 'ThemeProvider';
