import { useCallback, useMemo } from 'react';

import {
  useGetHello,
  type GetHelloQueryError,
  type GetHelloQueryResult,
} from '@/lib/api/gen/endpoints/client/hello/hello';

interface UseHelloQueryReturn {
  data: GetHelloQueryResult | undefined;
  isLoading: boolean;
  error: GetHelloQueryError | null;
  executeQuery: () => Promise<void>;
  formattedResponse: string;
}

function isErrorResponseData(data: unknown): data is { error?: string } {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  return 'error' in data;
}

export const useHelloQuery = (): UseHelloQueryReturn => {
  const { data, isLoading, error, refetch } = useGetHello({
    query: {
      enabled: false, // Manual execution only
    },
  });

  const executeQuery = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const formattedResponse = useMemo(() => {
    if (isLoading) return 'Loading...';
    if (error) {
      const statusCode = error.error ?? 'unknown';
      let errorMessage = 'Request failed';

      if (isErrorResponseData(error.message)) {
        errorMessage = error.message ?? 'Request failed';
      }

      return `Error (${statusCode}): ${errorMessage}`;
    }
    if (!data) return 'Click "Execute Request" to fetch data';
    return JSON.stringify(data, null, 2);
  }, [data, isLoading, error]);

  return {
    data,
    isLoading,
    error,
    executeQuery,
    formattedResponse,
  };
};
