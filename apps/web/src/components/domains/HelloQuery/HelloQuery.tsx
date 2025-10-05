import { memo } from 'react';

import { useHelloQuery } from '@/components/domains/HelloQuery/useHelloQuery';
import { useLogin } from '@/hooks/useLogin/useLogin';

export interface HelloQueryProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const HelloQuery = memo(({ ref }: HelloQueryProps) => {
  const { queryString, response, loading, handleExecuteQuery } =
    useHelloQuery();

  const {
    isAuthenticated,
    isLoading: authLoading,
    userName,
    error: authError,
    handleLogin,
    handleLogout,
  } = useLogin();

  return (
    <div ref={ref} className='flex flex-col lg:flex-row gap-6 w-full'>
      {/* Left Column - Query */}
      <div className='flex-1 flex flex-col gap-4'>
        <h2 className='text-xl font-semibold text-foreground'>GraphQL Query</h2>
        <pre className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4 text-sm font-mono text-foreground overflow-x-auto'>
          {queryString}
        </pre>

        {/* Authentication Section */}
        {authLoading ? (
          <div className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4'>
            <p className='text-sm text-foreground/60'>Checking authentication status...</p>
          </div>
        ) : authError ? (
          <div className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4'>
            <p className='text-sm text-red-600 dark:text-red-400'>
              Authentication Error: {authError.message}
            </p>
          </div>
        ) : !isAuthenticated ? (
          <div className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4 flex flex-col gap-3'>
            <p className='text-sm text-foreground/80'>
              You need to log in to execute GraphQL queries
            </p>
            <button
              onClick={handleLogin}
              className='rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] h-10 px-6 font-semibold'
            >
              Login
            </button>
          </div>
        ) : (
          <div className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4 flex items-center justify-between'>
            <p className='text-sm text-foreground/80'>
              Logged in as: <span className='font-semibold'>{userName}</span>
            </p>
            <button
              onClick={handleLogout}
              className='rounded-lg border border-solid border-black/[.1] dark:border-white/[.145] transition-colors bg-transparent text-foreground hover:bg-black/[.05] dark:hover:bg-white/[.05] h-8 px-4 text-sm font-medium'
            >
              Logout
            </button>
          </div>
        )}

        <button
          onClick={handleExecuteQuery}
          disabled={loading || !isAuthenticated || authLoading}
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
});

HelloQuery.displayName = 'HelloQuery';
