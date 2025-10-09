import { Geist, Geist_Mono } from 'next/font/google';

// eslint-disable-next-line import/no-relative-parent-imports
import { LoginSection } from '@/components/domains/LoginSection';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen p-8 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className='max-w-4xl mx-auto py-12'>
        <h1 className='text-4xl font-bold mb-8 text-center'>
          Auth0 Login Demo
        </h1>
        <LoginSection />
      </main>
    </div>
  );
}
