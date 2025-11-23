import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { buildContainer } from '@/interfaces/di/container';
import { createAuth0Middleware } from '@/interfaces/http/middleware/auth';
import { errorHandler } from '@/interfaces/http/middleware/errorHandler';
import { helloApp } from '@/interfaces/http/routes/hello.routes';
import type { AppEnv } from '@/interfaces/http/types';
import { configureOpenAPI } from '@/lib/openapi';

const app = new OpenAPIHono<AppEnv>();

app.use('*', secureHeaders());

// Runtime-portable CORS configuration using hono/adapter
app.use('*', async (c, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { CORS_ORIGIN } = env<{ CORS_ORIGIN: string }>(c);
  const corsMiddleware = cors({
    origin: CORS_ORIGIN,
    credentials: true,
  });
  return corsMiddleware(c as never, next);
});

// Runtime-portable logger middleware
app.use('*', async (c, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { NODE_ENV } = env<{ NODE_ENV: string }>(c);
  if (NODE_ENV !== 'production') {
    const loggerMiddleware = logger();
    return loggerMiddleware(c as never, next);
  }
  return next();
});

app.use('*', async (c, next) => {
  const container = buildContainer(c as never);
  c.set('container', container);
  c.set('logger', container.logger);
  await next();
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Runtime-portable Auth0 middleware initialization
app.use('/v1/*', async (c, next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = env<{ AUTH0_DOMAIN: string; AUTH0_AUDIENCE: string }>(c);

  const authMiddleware = createAuth0Middleware({
    domain: AUTH0_DOMAIN,
    audience: AUTH0_AUDIENCE,
  });

  return authMiddleware(c as never, next);
});

app.route('/v1/hello', helloApp);

configureOpenAPI(app);

app.onError(errorHandler);

export default app;
