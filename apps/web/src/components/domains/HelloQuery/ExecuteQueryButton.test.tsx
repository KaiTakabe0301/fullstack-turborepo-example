import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ExecuteQueryButton } from '@/components/domains/HelloQuery/ExecuteQueryButton';

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

describe('ExecuteQueryButton', () => {
  it('should display initial state with "Execute Request" button', () => {
    render(<ExecuteQueryButton isAuthenticated={true} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('REST API Request')).toBeInTheDocument();
    expect(screen.getByText('GET /api/hello')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Execute Request' })).toBeEnabled();
    expect(
      screen.getByText('Click "Execute Request" to fetch data')
    ).toBeInTheDocument();
  });

  it('should disable button when not authenticated', () => {
    render(<ExecuteQueryButton isAuthenticated={false} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByRole('button', { name: 'Execute Request' })
    ).toBeDisabled();
  });

  it('should execute query and display response on button click', async () => {
    const user = userEvent.setup();
    render(<ExecuteQueryButton isAuthenticated={true} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByRole('button', { name: 'Execute Request' });
    await user.click(button);

    // Wait for response
    await waitFor(() => {
      expect(
        screen.getByText(/"message": "Hello from API!"/)
      ).toBeInTheDocument();
    });

    // Button should be enabled again after query completes
    expect(screen.getByRole('button', { name: 'Execute Request' })).toBeEnabled();
  });

  it('should display error message when request fails', async () => {
    server.use(
      http.get('*/api/hello', () => {
        return HttpResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      })
    );

    const user = userEvent.setup();
    render(<ExecuteQueryButton isAuthenticated={true} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByRole('button', { name: 'Execute Request' });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Error \(401\)/)).toBeInTheDocument();
    });
  });

  it('should display network error when request fails without response', async () => {
    server.use(
      http.get('*/api/hello', () => {
        return HttpResponse.error();
      })
    );

    const user = userEvent.setup();
    render(<ExecuteQueryButton isAuthenticated={true} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByRole('button', { name: 'Execute Request' });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
  });
});
