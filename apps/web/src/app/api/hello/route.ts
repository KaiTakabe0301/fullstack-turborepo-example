import { NextResponse } from 'next/server';

import { auth0 } from '@/lib/auth0';

/**
 * Backend API response type for /api/hello
 */
interface HelloResponse {
  message: string;
}

/**
 * BFF Route Handler for /api/hello
 *
 * This endpoint acts as a Backend for Frontend (BFF) proxy to the backend API.
 * It retrieves an Auth0 access token server-side and forwards the request
 * to the backend API with proper authentication, preventing token exposure to the browser.
 *
 * @returns HelloResponse from backend API
 */
export async function GET() {
  try {
    // Step 1: Verify user is authenticated
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in.' },
        { status: 401 }
      );
    }

    // Step 2: Retrieve Auth0 access token (with automatic refresh)
    const accessTokenResult = await auth0.getAccessToken();

    if (!accessTokenResult?.token) {
      return NextResponse.json(
        { error: 'Failed to retrieve access token. Please try logging in again.' },
        { status: 401 }
      );
    }

    // Step 3: Call backend API with Bearer token
    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
    const backendResponse = await fetch(`${apiUrl}/api/hello`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessTokenResult.token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    // Step 4: Handle backend API errors
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();

      // eslint-disable-next-line no-console
      console.error(
        `Backend API error (${backendResponse.status}):`,
        errorText
      );

      return NextResponse.json(
        {
          error: 'Backend API request failed',
          details:
            process.env.NODE_ENV === 'development' ? errorText : undefined,
        },
        { status: backendResponse.status }
      );
    }

    // Step 5: Return successful response
    const data = (await backendResponse.json()) as HelloResponse;
    return NextResponse.json(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('BFF API route error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
