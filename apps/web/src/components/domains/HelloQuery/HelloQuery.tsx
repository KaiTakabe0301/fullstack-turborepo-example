import { HelloQueryExecutor } from '@/components/domains/HelloQuery/HelloQueryExecutor';
import { auth0 } from '@/lib/auth0';

export async function HelloQuery() {
  const session = await auth0.getSession();
  // eslint-disable-next-line @kaitakabe0301/react-memo/require-usememo
  const isAuthenticated = Boolean(session);
  const userName = session?.user?.name ?? 'Unknown';

  return (
    <div className='flex flex-col gap-6 w-full'>
      {/* Authentication Section */}
      <div className='bg-black/[.03] dark:bg-white/[.06] border border-black/[.1] dark:border-white/[.145] rounded-lg p-4'>
        {!isAuthenticated ? (
          <div className='flex flex-col gap-3'>
            <p className='text-sm text-foreground/80'>
              You need to log in to execute GraphQL queries
            </p>
            <a
              href='/auth/login'
              className='rounded-lg border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] h-10 px-6 font-semibold inline-flex items-center justify-center'
            >
              Login
            </a>
          </div>
        ) : (
          <div className='flex items-center justify-between'>
            <p className='text-sm text-foreground/80'>
              Logged in as: <span className='font-semibold'>{userName}</span>
            </p>
            <a
              href='/auth/logout'
              className='rounded-lg border border-solid border-black/[.1] dark:border-white/[.145] transition-colors bg-transparent text-foreground hover:bg-black/[.05] dark:hover:bg-white/[.05] h-8 px-4 text-sm font-medium inline-flex items-center justify-center'
            >
              Logout
            </a>
          </div>
        )}
      </div>

      {/* Query Executor */}
      <HelloQueryExecutor isAuthenticated={isAuthenticated} />
    </div>
  );
}
