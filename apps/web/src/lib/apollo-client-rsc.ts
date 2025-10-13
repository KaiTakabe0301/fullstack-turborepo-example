'server-only';

import { ApolloLink, HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';

import { auth0 } from '@/lib/auth0';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(v => typeof v === 'string');
}

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3001/graphql',
    fetchOptions: {
      cache: 'no-store',
    },
  });

  // Server Components用の認証リンク
  // リクエストごとに自動的にAuth0トークンを取得してヘッダーに付与
  const authLink = new SetContextLink(async prevContext => {
    const existingHeaders: Record<string, string> = isStringRecord(
      prevContext.headers
    )
      ? prevContext.headers
      : {};

    try {
      const session = await auth0.getSession();

      if (!session) {
        return { headers: existingHeaders };
      }

      const accessToken = await auth0.getAccessToken();

      if (!accessToken) {
        return { headers: existingHeaders };
      }

      return {
        headers: {
          ...existingHeaders,
          authorization: `Bearer ${accessToken.token}`,
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get access token:', error);
      return { headers: existingHeaders };
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, httpLink]),
  });
});
