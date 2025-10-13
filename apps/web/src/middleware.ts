import { NextResponse, type NextRequest } from 'next/server';

import { auth0 } from '@/lib/auth0';

export async function middleware(request: NextRequest) {
  // Server Action の POST は素通し（セッション更新を避ける）
  if (request.method === 'POST' && request.headers.has('Next-Action')) {
    return NextResponse.next();
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
