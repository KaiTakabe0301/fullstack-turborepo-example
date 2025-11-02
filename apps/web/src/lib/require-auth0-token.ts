'server-only';

import { auth0 } from '@/lib/auth0';

/**
 * Retrieves Auth0 access token for the current user session.
 * If no session exists or token retrieval fails, returns null.
 * @returns
 */
export const requireAuth0Token = async () => {
  const session = await auth0.getSession();
  if (!session) {
    return null;
  }
  const accessTokenResult = await auth0.getAccessToken();
  return accessTokenResult?.token ?? null;
};
