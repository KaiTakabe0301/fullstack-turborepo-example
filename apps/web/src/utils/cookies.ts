import Cookies from 'js-cookie';

export type Theme = 'light' | 'dark';

const THEME_COOKIE_KEY = 'theme';
const COOKIE_MAX_AGE = 365; // 1 year

export const themeCookies = {
  get: (): Theme | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    const theme = Cookies.get(THEME_COOKIE_KEY);
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    return null;
  },

  set: (theme: Theme): void => {
    if (typeof window === 'undefined') {
      return;
    }
    Cookies.set(THEME_COOKIE_KEY, theme, {
      expires: COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  },

  remove: (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    Cookies.remove(THEME_COOKIE_KEY);
  },
};
