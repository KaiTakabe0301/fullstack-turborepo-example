import { type ZodType, treeifyError } from 'zod';

import {
  HTTPFetchError,
  isAbortError,
  isFetchError,
  NetworkFetchError,
  ParseFetchError,
  TimeoutFetchError,
} from '@/lib/error';

export type SafeFetchOptions = RequestInit & {
  timeoutMs?: number;
  correlationId?: string;
  correlationHeader?: string;
};

export async function safeFetch<T>(
  input: RequestInfo | URL,
  options?: SafeFetchOptions,
  schema?: ZodType
): Promise<T> {
  const {
    correlationId = crypto.randomUUID(),
    correlationHeader = 'x-correlation-id',
    timeoutMs = 10_000,
    ...init
  } = options ?? {};

  // Prepare request details
  const url =
    typeof input === 'string'
      ? input
      : typeof input === 'object' && 'href' in input
        ? input.toString()
        : input.url;
  const method = init.method?.toUpperCase() ?? 'GET';

  // Create headers
  const headers = new Headers(init.headers ?? {});
  headers.set(correlationHeader, correlationId);
  headers.set('Content-Type', 'application/json');

  // Set cache control
  const cache = init.cache ?? 'no-cache';

  // Setting timeout for fetch
  const ac = new AbortController();
  const timeoutId = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
    const response = await fetch(`${apiUrl}${url}`, {
      ...init,
      cache,
      method,
      headers,
      signal: ac.signal,
    });

    if (!response.ok) {
      let body: any = null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body = await response.clone().json();
      } catch {
        // Ignore JSON parse errors
        try {
          body = await response.clone().text();
        } catch {
          body = null;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const code: string =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof body?.code === 'string' ? body.code : 'UNKNOWN_ERROR';

      const err = new HTTPFetchError({
        code,
        correlationId,
        message: `HTTP error ${response.status} for ${method} ${url}`,
        method,
        kind: 'http',
        url,
        status: response.status,
      });

      throw err;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (cause) {
      const err = new ParseFetchError({
        kind: 'parse',
        correlationId,
        message: `Failed to parse JSON response from ${method} ${url}`,
        method,
        details: { contentType: response.headers.get('Content-Type') },
        url,
        cause,
      });
      throw err;
    }

    if (schema) {
      const parseResult = schema.safeParse(data);

      if (parseResult.error) {
        const err = new ParseFetchError({
          kind: 'parse',
          correlationId,
          message: `Zod validation failed for ${method} ${url}`,
          method,
          details: treeifyError(parseResult.error),
          url,
        });
        throw err;
      }
      return parseResult.data as T;
    }

    return data as T;
  } catch (error: unknown) {
    if (isAbortError(error)) {
      const err = new TimeoutFetchError({
        kind: 'timeout',
        correlationId,
        message: `Request timed out after ${timeoutMs}ms for ${method} ${url}`,
        method,
        url,
      });
      throw err;
    }

    if (!isFetchError(error)) {
      const err = new NetworkFetchError({
        kind: 'network',
        correlationId,
        message: `Network error for ${method} ${url}`,
        method,
        url,
        cause: error,
      });
      throw err;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
