'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { memo, useMemo } from 'react';

import { FetchError, type ErrorType } from '@/lib/api/fetcher';

interface QueryProviderProps {
  children: React.ReactNode;
}

function isErrorType(error: unknown): error is ErrorType {
  // Check if error is instance of FetchError
  if (error instanceof FetchError) {
    return true;
  }
  // Fallback to structural check for other error types
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  if (!('status' in error)) {
    return false;
  }
  // After the 'status' in error check, TypeScript knows status exists
  const errorObj: Record<string, unknown> = error;
  return typeof errorObj.status === 'number';
}

export const QueryProvider = memo(({ children }: QueryProviderProps) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000,
            refetchOnWindowFocus: false,
            retry(failureCount, error) {
              if (isErrorType(error) && error.status === 401) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
});

QueryProvider.displayName = 'QueryProvider';
