'use server';

import {
  CombinedGraphQLErrors,
  ServerError,
  ServerParseError,
} from '@apollo/client/errors';

import { graphql } from '@/graphql/__generated__';
import { query } from '@/lib/apollo-client-rsc';

const GetHello = graphql(`
  query getHello {
    hello
  }
`);

export interface HelloQueryResult {
  success: boolean;
  data?: {
    hello: string;
  };
  error?: string;
  errorType?: 'graphql' | 'network' | 'server' | 'parse' | 'unknown';
}

export async function executeHelloQuery(): Promise<HelloQueryResult> {
  try {
    // apollo-client-rsc.tsのSetContextLinkが自動的に認証ヘッダーを付与
    const result = await query({
      query: GetHello,
      errorPolicy: 'all', // Apollo公式ドキュメント推奨: エラーとデータの両方を取得
    });

    // errorPolicyが'all'の場合、エラーが発生してもresultは返される
    if (result.error) {
      // Apollo公式ドキュメントに従い、静的メソッドでエラータイプを判定
      if (CombinedGraphQLErrors.is(result.error)) {
        // GraphQLエラー（構文、バリデーション、リゾルバエラー）
        const errorMessages = result.error.errors
          .map(err => err.message)
          .join(', ');
        return {
          success: false,
          error: `GraphQL Error: ${errorMessages}`,
          errorType: 'graphql',
          data: result.data, // 部分的なデータがあれば含める
        };
      }

      if (ServerError.is(result.error)) {
        // HTTPステータスコードエラー（4xx, 5xx）
        return {
          success: false,
          error: `Server Error (${result.error.statusCode}): ${result.error.message}`,
          errorType: 'server',
        };
      }

      if (ServerParseError.is(result.error)) {
        // レスポンスのパースエラー
        return {
          success: false,
          error: `Parse Error: ${result.error.message}`,
          errorType: 'parse',
        };
      }

      // その他のネットワークエラー
      return {
        success: false,
        error: `Network Error: ${result.error.message}`,
        errorType: 'network',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    // クエリ実行時の予期しないエラー
    if (CombinedGraphQLErrors.is(error)) {
      const errorMessages = error.errors.map(err => err.message).join(', ');
      return {
        success: false,
        error: `GraphQL Error: ${errorMessages}`,
        errorType: 'graphql',
      };
    }

    if (ServerError.is(error)) {
      return {
        success: false,
        error: `Server Error (${error.statusCode}): ${error.message}`,
        errorType: 'server',
      };
    }

    if (ServerParseError.is(error)) {
      return {
        success: false,
        error: `Parse Error: ${error.message}`,
        errorType: 'parse',
      };
    }

    // その他のエラー
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      errorType: 'unknown',
    };
  }
}
