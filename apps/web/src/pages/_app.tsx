import '@/styles/globals.css';
import { ApolloProvider } from '@apollo/client/react';
import { parse } from 'cookie';
import App, {
  type AppProps,
  type AppContext,
  type AppInitialProps,
} from 'next/app';

import { ThemeProvider, type Theme } from '@/contexts/ThemeContext';
import { apolloClient } from '@/lib/apollo-client';

interface MyAppPageProps {
  initialTheme: Theme;
}

interface MyAppProps extends AppProps<MyAppPageProps> {
  pageProps: MyAppPageProps;
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <ThemeProvider initialTheme={pageProps.initialTheme}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (
  appContext: AppContext
): Promise<AppInitialProps & { pageProps: MyAppPageProps }> => {
  const appProps = await App.getInitialProps(appContext);

  let theme: Theme = 'light';

  if (appContext.ctx.req?.headers.cookie) {
    const cookies = parse(appContext.ctx.req.headers.cookie);
    if (cookies.theme === 'light' || cookies.theme === 'dark') {
      theme = cookies.theme;
    }
  }

  return {
    ...appProps,
    pageProps: {
      ...(appProps.pageProps as Record<string, unknown>),
      initialTheme: theme,
    },
  };
};

export default MyApp;
