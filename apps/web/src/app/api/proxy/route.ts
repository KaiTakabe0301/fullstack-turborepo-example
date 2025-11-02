import type { NextRequest } from 'next/server';

import { safeFetchAuth } from '@/lib/fetcher/safe-fetch-auth';

/**
 * BFF Route Handler for /api/hello
 *
 * This endpoint acts as a Backend for Frontend (BFF) proxy to the backend API.
 * It retrieves an Auth0 access token server-side and forwards the request
 * to the backend API with proper authentication, preventing token exposure to the browser.
 *
 * @returns HelloResponse from backend API
 */
export async function POST(req: NextRequest) {
  const payload = await req.json();

  const { input, options } = payload;

  const data = await safeFetchAuth(input, options);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
