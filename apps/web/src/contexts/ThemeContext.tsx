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
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  initialTheme: Theme;
  children: ReactNode;
}

export const ThemeProvider = memo(
  ({ initialTheme, children }: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<Theme>(initialTheme);

    // クライアントマウント時にDOMの実際の値を読み取ってReact状態と同期
    // これにより、_document.tsxのthemeScriptでOSから取得した値を反映できる
    useEffect(() => {
      const actualTheme = document.documentElement.getAttribute('data-theme');
      if (actualTheme && (actualTheme === 'light' || actualTheme === 'dark')) {
        if (actualTheme !== initialTheme) {
          setThemeState(actualTheme);
        }
      }
      // initialThemeは初回マウント時のみ使用するため、依存配列に含める
    }, [initialTheme]);

    const setTheme = useCallback((newTheme: Theme) => {
      setThemeState(newTheme);

      // クライアントサイドでのみCookieとdata-theme属性を更新
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', newTheme);
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
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
  }
);

ThemeProvider.displayName = 'ThemeProvider';
