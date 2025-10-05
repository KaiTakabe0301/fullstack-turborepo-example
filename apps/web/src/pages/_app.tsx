import '@/styles/globals.css';

import { ApolloProvider } from '@apollo/client';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';

// eslint-disable-next-line import/no-relative-parent-imports
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

export default function App({ Component, pageProps }: AppProps) {
  const authorizationParams = useMemo(
    () => ({
      redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    }),
    []
  );

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? ''}
      authorizationParams={authorizationParams}
    >
      <ApolloWrapper>
        <Component {...pageProps} />
      </ApolloWrapper>
    </Auth0Provider>
  );
}
