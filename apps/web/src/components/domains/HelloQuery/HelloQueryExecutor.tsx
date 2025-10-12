'use client';

import { memo } from 'react';

import { useHelloQuery } from '@/components/domains/HelloQuery/useHelloQuery';

interface HelloQueryExecutorProps {
  isAuthenticated: boolean;
}

export const HelloQueryExecutor = memo(
  ({ isAuthenticated }: HelloQueryExecutorProps) => {
    const { queryString, response, loading, handleExecuteQuery } =
      useHelloQuery();

    return (
      <div className='flex flex-col lg:flex-row gap-6 w-full'>
        {/* Left Column - Query */}
        <div className='flex-1 flex flex-col gap-4'>
          <h2 className='text-xl font-semibold text-foreground'>
            GraphQL Query
          </h2>
          <pre className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4 text-sm font-mono text-foreground overflow-x-auto'>
            {queryString}
          </pre>

          <button
            onClick={handleExecuteQuery}
            disabled={loading || !isAuthenticated}
            className='rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] h-12 px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>

        {/* Right Column - Response */}
        <div className='flex-1 flex flex-col gap-4'>
          <h2 className='text-xl font-semibold text-foreground'>Response</h2>
          <pre className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4 text-sm font-mono text-foreground overflow-x-auto min-h-[200px]'>
            {response}
          </pre>
        </div>
      </div>
    );
  }
);

HelloQueryExecutor.displayName = 'HelloQueryExecutor';
