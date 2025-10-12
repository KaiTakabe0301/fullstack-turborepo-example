import { NextResponse } from 'next/server';

import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tokenResult = await auth0.getAccessToken();

    if (!tokenResult) {
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    return NextResponse.json({ accessToken: tokenResult });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting access token:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}
