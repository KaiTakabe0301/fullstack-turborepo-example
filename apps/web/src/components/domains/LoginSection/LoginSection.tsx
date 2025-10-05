import { memo } from 'react';

import { useLoginSection } from '@/components/domains/LoginSection/useLoginSection';

export const LoginSection = memo(() => {
  const {
    isAuthenticated,
    isLoading,
    userName,
    error,
    handleLogin,
    handleLogout,
    handleFetchHello,
    helloMessage,
    helloLoading,
    helloError,
  } = useLoginSection();

  if (isLoading) {
    return (
      <div className='p-8 bg-gray-100 rounded-lg'>
        <p className='text-gray-600'>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8 bg-red-100 rounded-lg'>
        <p className='text-red-600'>Error: {error.message}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='p-8 bg-gray-100 rounded-lg'>
        <h2 className='text-2xl font-bold mb-4'>ログインしていません</h2>
        <button
          onClick={handleLogin}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          ログイン
        </button>
      </div>
    );
  }

  return (
    <div className='p-8 bg-gray-100 rounded-lg'>
      <h2 className='text-2xl font-bold mb-4'>ログイン中</h2>
      <p className='mb-4'>ようこそ、{userName}さん</p>

      <div className='flex gap-4 mb-6'>
        <button
          onClick={handleFetchHello}
          disabled={helloLoading}
          className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400'
        >
          {helloLoading ? '読み込み中...' : 'Hello クエリを実行'}
        </button>
        <button
          onClick={handleLogout}
          className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
        >
          ログアウト
        </button>
      </div>

      {helloMessage && (
        <div className='p-4 bg-green-100 rounded'>
          <p className='text-green-800'>
            <strong>レスポンス:</strong> {helloMessage}
          </p>
        </div>
      )}

      {helloError && (
        <div className='p-4 bg-red-100 rounded'>
          <p className='text-red-800'>
            <strong>エラー:</strong> {helloError.message}
          </p>
        </div>
      )}
    </div>
  );
});

LoginSection.displayName = 'LoginSection';
