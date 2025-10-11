/**
 * ThemeScript component
 *
 * This component renders an inline script that executes before React hydration.
 * It reads the theme from localStorage or falls back to the OS preference (prefers-color-scheme).
 * This prevents FOUC (Flash of Unstyled Content) and respects user preferences.
 */

// Inline script that runs before React hydration
const themeScript = `
  (function() {
    try {
      var storedTheme = localStorage.getItem('theme');
      var theme;

      if (storedTheme === 'light' || storedTheme === 'dark') {
        theme = storedTheme;
      } else {
        // No stored theme, use OS preference
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      // localStorage might be unavailable (e.g., in private mode)
      // Fall back to light theme
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

const scriptProps = {
  __html: themeScript,
};

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={scriptProps} />;
}
