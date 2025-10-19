import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { useHelloQuery } from '@/components/domains/HelloQuery/useHelloQuery';

// MSW server setup
const server = setupServer(
  http.get('*/api/hello', () => {
    return HttpResponse.json({ message: 'Hello from API!' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

describe('useHelloQuery', () => {
  it('should return initial state with placeholder message', () => {
    const { result } = renderHook(() => useHelloQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.formattedResponse).toBe(
      'Click "Execute Request" to fetch data'
    );
  });

  it('should fetch data successfully when executeQuery is called', async () => {
    const { result } = renderHook(() => useHelloQuery(), {
      wrapper: createWrapper(),
    });

    await result.current.executeQuery();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ message: 'Hello from API!' });
    expect(result.current.error).toBeNull();
    expect(result.current.formattedResponse).toContain(
      '"message": "Hello from API!"'
    );
  });

  it('should show loading state and formatted response after completion', async () => {
    const { result } = renderHook(() => useHelloQuery(), {
      wrapper: createWrapper(),
    });

    // Initial state
    expect(result.current.formattedResponse).toBe(
      'Click "Execute Request" to fetch data'
    );

    // Execute query
    await result.current.executeQuery();

    // After completion, should have data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.formattedResponse).toContain(
        '"message": "Hello from API!"'
      );
    });
  });

  it('should handle 401 error correctly', async () => {
    server.use(
      http.get('*/api/hello', () => {
        return HttpResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      })
    );

    const { result } = renderHook(() => useHelloQuery(), {
      wrapper: createWrapper(),
    });

    await result.current.executeQuery();

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.formattedResponse).toContain('Error (401)');
    expect(result.current.formattedResponse).toContain('Unauthorized');
  });

  it('should handle 500 error correctly', async () => {
    server.use(
      http.get('*/api/hello', () => {
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 }
        );
      })
    );

    const { result } = renderHook(() => useHelloQuery(), {
      wrapper: createWrapper(),
    });

    await result.current.executeQuery();

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.formattedResponse).toContain('Error (500)');
  });

  it('should handle network error correctly', async () => {
    server.use(
      http.get('*/api/hello', () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useHelloQuery(), {
      wrapper: createWrapper(),
    });

    await result.current.executeQuery();

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.formattedResponse).toContain('Error');
  });

  it('should memoize executeQuery callback', () => {
    const { result, rerender } = renderHook(() => useHelloQuery(), {
      wrapper: createWrapper(),
    });

    const executeQuery1 = result.current.executeQuery;
    rerender();
    const executeQuery2 = result.current.executeQuery;

    expect(executeQuery1).toBe(executeQuery2);
  });
});
