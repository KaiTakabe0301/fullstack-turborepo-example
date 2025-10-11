import { useLazyQuery } from '@apollo/client/react';
import { useCallback, useMemo } from 'react';

import { graphql } from '@/graphql/__generated__/gql';

export const GET_HELLO = graphql(`
  query getHello {
    hello
  }
`);

export const useHelloQuery = () => {
  const [executeQuery, { data, loading, error }] = useLazyQuery(GET_HELLO);

  const handleExecuteQuery = useCallback(() => {
    void executeQuery();
  }, [executeQuery]);

  const queryString = useMemo(
    () => `query getHello {
  hello
}`,
    []
  );

  const response = useMemo(() => {
    if (loading) return 'Loading...';
    if (error) return `Error: ${error.message}`;
    if (data) return JSON.stringify(data, null, 2);
    return 'Click "Execute Query" to fetch data';
  }, [data, loading, error]);

  return {
    queryString,
    response,
    loading,
    handleExecuteQuery,
  };
};
