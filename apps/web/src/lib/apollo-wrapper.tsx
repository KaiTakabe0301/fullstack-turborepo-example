'use client';

import { HttpLink } from '@apollo/client';
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

      return new ApolloClient({
        cache: new InMemoryCache(),
        link: httpLink,
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
