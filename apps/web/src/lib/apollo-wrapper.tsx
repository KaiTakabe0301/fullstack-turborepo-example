'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { memo, useMemo } from 'react';

interface ApolloWrapperProps {
  children: React.ReactNode;
}

interface AccessTokenResponse {
  accessToken: {
    token: string;
    expiresAt: number;
    scope?: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(v => typeof v === 'string');
}

function isAccessTokenResponse(data: unknown): data is AccessTokenResponse {
  if (!isRecord(data)) {
    return false;
  }

  if (!('accessToken' in data)) {
    return false;
  }

  const { accessToken } = data;

  if (!isRecord(accessToken)) {
    return false;
  }

  if (!('token' in accessToken) || !('expiresAt' in accessToken)) {
    return false;
  }

  return (
    typeof accessToken.token === 'string' &&
    typeof accessToken.expiresAt === 'number'
  );
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

      const authLink = new SetContextLink(async prevContext => {
        const existingHeaders: Record<string, string> = isStringRecord(
          prevContext.headers
        )
          ? prevContext.headers
          : {};

        try {
          const response = await fetch('/api/token');
          if (response.ok) {
            const data: unknown = await response.json();

            if (isAccessTokenResponse(data)) {
              const token = data.accessToken.token;

              return {
                headers: {
                  ...existingHeaders,
                  ...(token ? { authorization: `Bearer ${token}` } : {}),
                },
              };
            }
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
