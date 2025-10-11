import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { themes } from '@storybook/theming';
import { createElement } from 'react';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      container: (props: any) => {
        const el = document.querySelector('html');
        const currentTheme = props?.context.store.userGlobals?.globals?.theme;
        const storybookTheme =
          currentTheme === 'dark' ? themes.dark : themes.light;

        if (el && currentTheme) {
          el.dataset['theme'] = currentTheme;
        }

        const newProps = { ...props, theme: storybookTheme };
        return createElement(DocsContainer, newProps);
      },
    },
  },
};

export default preview;
