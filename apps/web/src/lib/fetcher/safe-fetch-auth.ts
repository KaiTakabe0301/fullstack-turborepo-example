'server-only';
import type { ZodType } from 'zod';

import { safeFetch, type SafeFetchOptions } from '@/lib/fetcher/safe-fetch';
import { requireAuth0Token } from '@/lib/require-auth0-token';

export async function safeFetchAuth<T>(
  input: RequestInfo | URL,
  options?: SafeFetchOptions,
  schema?: ZodType
): Promise<T> {
  const token = await requireAuth0Token();
  const headers = new Headers(options?.headers ?? {});

  if (!token) {
    // Indicate that the token is missing
    headers.set('x-safe-fetch-auth-missing-token', 'true');
  } else {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return safeFetch<T>(input, { ...options, headers }, schema);
}
