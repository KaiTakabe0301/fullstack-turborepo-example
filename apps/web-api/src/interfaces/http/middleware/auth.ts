import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createRemoteJWKSet, jwtVerify, errors, type JWTPayload } from 'jose';

import type { AppEnv } from '@/interfaces/http/types';

interface Auth0Payload extends JWTPayload {
  scope?: string;
  permissions?: string[];
}

export function createAuth0Middleware(options: {
  domain: string;
  audience: string;
}): MiddlewareHandler<AppEnv> {
  const issuer = `https://${options.domain}/`;

  const jwks = createRemoteJWKSet(
    new URL(`https://${options.domain}/.well-known/jwks.json`),
    {
      cacheMaxAge: 10 * 60 * 1000,
      cooldownDuration: 30_000,
    }
  );

  return async (c, next) => {
    const authHeader = c.req.header('authorization') ?? '';
    const match = authHeader.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      throw new HTTPException(401, {
        message: 'Missing or invalid Authorization header',
      });
    }

    const token = match[1];

    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer,
        audience: options.audience,
        algorithms: ['RS256'],
      });

      c.set('user', payload as Auth0Payload);
      await next();
    } catch (err) {
      if (err instanceof errors.JWTExpired) {
        throw new HTTPException(401, { message: 'Token expired' });
      }
      if (err instanceof errors.JWTClaimValidationFailed) {
        throw new HTTPException(401, { message: 'Invalid token claims' });
      }
      throw new HTTPException(401, { message: 'Invalid token' });
    }
  };
}

export function requirePermission(permission: string): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const user = c.get('user');

    if (!user?.permissions?.includes(permission)) {
      throw new HTTPException(403, {
        message: `Missing required permission: ${permission}`,
      });
    }

    await next();
  };
}

export function requireScope(scope: string): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const user = c.get('user');
    const scopes = user?.scope?.split(' ') ?? [];

    if (!scopes.includes(scope)) {
      throw new HTTPException(403, {
        message: `Missing required scope: ${scope}`,
      });
    }

    await next();
  };
}
