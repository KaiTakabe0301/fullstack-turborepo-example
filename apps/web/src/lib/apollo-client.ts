import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const link = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3001/graphql',
})

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
