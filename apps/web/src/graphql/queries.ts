// GraphQL操作定義
// このファイルはcodegenが正しく動作するために必要です

import { graphql } from '@/graphql/__generated__/gql';

export const GET_HELLO = graphql(`
  query getHello {
    hello
  }
`);
