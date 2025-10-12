'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { memo, useMemo } from 'react';

interface ApolloWrapperProps {
  children: React.ReactNode;
}

export const ApolloWrapper = memo(({ children }: ApolloWrapperProps) => {
  const makeClient = useMemo(
    () => () => {
      const httpLink = new HttpLink({
        uri:
          process.env.NEXT_PUBLIC_GRAPHQL_URL ??
          'http://localhost:3001/graphql',
        fetchOptions: {
          cache: 'no-store',
        },
      });

      const authLink = setContext(async (_, { headers }) => {
        const existingHeaders = (headers as Record<string, string>) ?? {};
        try {
          const response = await fetch('/api/token');
          if (response.ok) {
            const data = (await response.json()) as {
              accessToken: {
                token: string;
                expiresAt: number;
                scope?: string;
              };
            };
            const token = data.accessToken.token;

            return {
              headers: {
                ...existingHeaders,
                ...(token ? { authorization: `Bearer ${token}` } : {}),
              },
            };
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to get access token:', error);
        }

        return { headers: existingHeaders };
      });

      return new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([authLink, httpLink]),
      });
    },
    []
  );

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
});

ApolloWrapper.displayName = 'ApolloWrapper';
