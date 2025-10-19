import { Auth0Provider } from '@auth0/nextjs-auth0';
import type { User } from '@auth0/nextjs-auth0/types';
import { memo } from 'react';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/lib/query-provider';

interface ProvidersProps {
  children: React.ReactNode;
  user?: User;
}

export const Providers = memo(({ children, user }: ProvidersProps) => {
  return (
    <Auth0Provider user={user}>
      <QueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryProvider>
    </Auth0Provider>
  );
});

Providers.displayName = 'Providers';
