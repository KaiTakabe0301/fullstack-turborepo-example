import '@/styles/globals.css';
import { ApolloProvider } from '@apollo/client/react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { parse } from 'cookie';
import App, {
  type AppProps,
  type AppContext,
  type AppInitialProps,
} from 'next/app';
import { useMemo } from 'react';

import { ThemeProvider, type Theme } from '@/contexts/ThemeContext';
import { createApolloClient } from '@/lib/apolloClient';

function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const client = useMemo(() => {
    return createApolloClient({
      getAccessToken: async () => {
        if (!isAuthenticated) {
          return undefined;
        }
        try {
          return await getAccessTokenSilently();
        } catch {
          return undefined;
        }
      },
    });
  }, [getAccessTokenSilently, isAuthenticated]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}


interface MyAppPageProps {
  initialTheme: Theme;
}

interface MyAppProps extends AppProps<MyAppPageProps> {
  pageProps: MyAppPageProps;
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const authorizationParams = useMemo(
    () => ({
      redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    }),
    []
  );
  return (
    <ThemeProvider initialTheme={pageProps.initialTheme}>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? ''}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? ''}
        authorizationParams={authorizationParams}
      >
        <ApolloWrapper>
          <Component {...pageProps} />
        </ApolloWrapper>
      </Auth0Provider>
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
