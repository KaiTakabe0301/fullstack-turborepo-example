import { memo, useMemo } from 'react';

import { HelloQuery } from '@/components/domains/HelloQuery';
import { TechStackCard } from '@/components/ui/TechStackCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const Home = memo(() => {
  const techStacks = useMemo(
    () => [
      {
        name: 'Next.js',
        version: 'v15',
        description: 'The React Framework for Production with Pages Router',
      },
      {
        name: 'React',
        version: 'v19',
        description: 'A JavaScript library for building user interfaces',
      },
      {
        name: 'NestJS',
        version: '',
        description: 'A progressive Node.js framework for server-side',
      },
      {
        name: 'GraphQL',
        version: '',
        description: 'A query language for your API',
      },
      {
        name: 'GraphQL Codegen',
        version: '',
        description: 'Generate code from GraphQL schema and operations',
      },
      {
        name: 'Apollo Client',
        version: '',
        description: 'A comprehensive state management library for GraphQL',
      },
      {
        name: 'Tailwind CSS',
        version: '',
        description: 'A utility-first CSS framework',
      },
      {
        name: 'TypeScript',
        version: '',
        description: 'JavaScript with syntax for types',
      },
      {
        name: 'Turborepo',
        version: '',
        description: 'High-performance build system for monorepos',
      },
    ],
    []
  );

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <main className='container mx-auto px-4 py-8 flex flex-col gap-12'>
        {/* 1段目: ボイラープレートの説明 */}
        <section className='flex flex-col gap-4 relative'>
          <div className='absolute top-0 right-0'>
            <ThemeToggle />
          </div>
          <h1 className='text-4xl font-bold text-center'>
            Fullstack Turborepo Boilerplate
          </h1>
          <p className='text-lg text-center text-foreground/80 max-w-3xl mx-auto'>
            A modern fullstack boilerplate built with Next.js, NestJS, GraphQL,
            and GraphQL Codegen. This project demonstrates best practices for
            building scalable web applications with TypeScript in a monorepo
            architecture.
          </p>
        </section>

        {/* 2段目: Hello クエリセクション */}
        <section className='flex flex-col gap-4'>
          <HelloQuery />
        </section>

        {/* 3段目: 技術スタックカード */}
        <section className='flex flex-col gap-6'>
          <h2 className='text-3xl font-bold text-center'>Tech Stack</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {techStacks.map(tech => (
              <TechStackCard
                key={tech.name}
                name={tech.name}
                description={tech.description}
                version={tech.version}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
