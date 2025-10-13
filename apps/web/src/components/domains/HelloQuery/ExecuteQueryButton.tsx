'use client';

import { memo, useActionState, useMemo } from 'react';

import {
  executeHelloQuery,
  type HelloQueryResult,
} from '@/components/domains/HelloQuery/actions';

interface ExecuteQueryButtonProps {
  isAuthenticated: boolean;
}

const initialState: HelloQueryResult | null = null;

export const ExecuteQueryButton = memo(
  ({ isAuthenticated }: ExecuteQueryButtonProps) => {
    const [state, formAction, isPending] = useActionState(
      executeHelloQuery,
      initialState
    );

    const queryString = useMemo(
      () => `query getHello {
  hello
}`,
      []
    );

    const response = useMemo(() => {
      if (isPending) return 'Loading...';
      if (!state) return 'Click "Execute Query" to fetch data';
      if (!state.success) return `Error: ${state.error}`;
      return JSON.stringify(state.data, null, 2);
    }, [isPending, state]);

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

          <form action={formAction}>
            <button
              disabled={isPending || !isAuthenticated}
              className='rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] h-12 px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isPending ? 'Executing...' : 'Execute Query'}
            </button>
          </form>
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

ExecuteQueryButton.displayName = 'ExecuteQueryButton';
