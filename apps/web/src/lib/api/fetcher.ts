export interface ErrorType<E = unknown> {
  status: number;
  data?: E;
}

export class FetchError<E = unknown> extends Error implements ErrorType<E> {
  constructor(
    public status: number,
    public data?: E
  ) {
    super(`HTTP Error ${status}`);
    this.name = 'FetchError';
  }
}

export async function customFetch<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.location.href = `/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
    }
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      // Ignore JSON parse errors
    }
    throw new FetchError(res.status, body);
  }

  if (res.status === 204 || res.status === 205) return undefined as T;

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}
