// GraphQL操作定義
// gql.tadaを使用した型安全なGraphQLクエリ

import { graphql } from 'gql.tada';

export const GET_HELLO = graphql(`
  query getHello {
    hello
  }
`);
