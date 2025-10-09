import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

interface CreateApolloClientOptions {
  getAccessToken: () => Promise<string | undefined>;
}

export const createApolloClient = ({
  getAccessToken,
}: CreateApolloClientOptions) => {
  const httpLink = new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL ??
      'http://localhost:3001/graphql',
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessToken();
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};
