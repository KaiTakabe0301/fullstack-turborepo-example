'use client';

import type { SafeFetchOptions } from '@/lib/fetcher/safe-fetch';

export async function safeFetchClient<T>(
  input: RequestInfo | URL,
  options?: SafeFetchOptions
) {

  const response = await fetch('/api/proxy', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input,
      options,
    }),
  });

  const data: unknown = await response.json();
  return data as T;
}
