import type { Metadata } from 'next';

import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import { ThemeScript } from '@/components/ThemeScript/ThemeScript';

export const metadata: Metadata = {
  title: 'Fullstack Turborepo Boilerplate',
  description:
    'A modern fullstack boilerplate built with Next.js, NestJS, GraphQL, and GraphQL Codegen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className='antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
