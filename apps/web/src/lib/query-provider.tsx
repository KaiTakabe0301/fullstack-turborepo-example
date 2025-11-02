'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { memo, useMemo } from 'react';

import { isHttpFetchError } from '@/lib/error';

interface QueryProviderProps {
  children: React.ReactNode;
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
              if (isHttpFetchError(error) && error.status === 401) {
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
