import type { Metadata } from 'next';

import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import { ThemeScript } from '@/components/ThemeScript/ThemeScript';
import { auth0 } from '@/lib/auth0';

export const metadata: Metadata = {
  title: 'Fullstack Turborepo Boilerplate',
  description:
    'A modern fullstack boilerplate built with Next.js, NestJS, GraphQL, and GraphQL Codegen.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className='antialiased'>
        <Providers user={session?.user}>{children}</Providers>
      </body>
    </html>
  );
}
