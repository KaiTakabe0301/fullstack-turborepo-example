'use client';

import { memo, useCallback } from 'react';

import { useHelloQuery } from '@/components/domains/HelloQuery/useHelloQuery';

interface ExecuteQueryButtonProps {
  isAuthenticated: boolean;
}

export const ExecuteQueryButton = memo(
  ({ isAuthenticated }: ExecuteQueryButtonProps) => {
    const { isLoading, executeQuery, formattedResponse } = useHelloQuery();

    const handleExecute = useCallback(() => {
      void executeQuery();
    }, [executeQuery]);

    return (
      <div className='flex flex-col gap-6 w-full'>
        {/* API Info Section */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl font-semibold text-foreground'>
            REST API Request
          </h2>
          <div className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4'>
            <p className='text-sm text-foreground/80 mb-2'>Endpoint:</p>
            <code className='text-sm font-mono text-foreground'>
              GET /api/hello
            </code>
          </div>

          <button
            disabled={isLoading || !isAuthenticated}
            onClick={handleExecute}
            className='rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] h-12 px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Executing...' : 'Execute Request'}
          </button>
        </div>

        {/* Response Section */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl font-semibold text-foreground'>Response</h2>
          <pre className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4 text-sm font-mono text-foreground overflow-x-auto min-h-[200px]'>
            {formattedResponse}
          </pre>
        </div>
      </div>
    );
  }
);

ExecuteQueryButton.displayName = 'ExecuteQueryButton';
