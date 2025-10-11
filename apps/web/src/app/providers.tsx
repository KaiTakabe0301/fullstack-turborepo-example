'use client';

import { memo } from 'react';

import { ThemeProvider,   } from '@/contexts/ThemeContext';
import { ApolloWrapper } from '@/lib/apollo-wrapper';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = memo(({ children,  }: ProvidersProps) => {
  return (
    <ThemeProvider >
      <ApolloWrapper>{children}</ApolloWrapper>
    </ThemeProvider>
  );
});

Providers.displayName = 'Providers';
