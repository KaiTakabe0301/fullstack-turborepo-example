import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { env } from '@/infrastructure/config/env';
import { buildContainer } from '@/interfaces/di/container';
import { createAuth0Middleware } from '@/interfaces/http/middleware/auth';
import { errorHandler } from '@/interfaces/http/middleware/errorHandler';
import { helloApp } from '@/interfaces/http/routes/hello.routes';
import type { AppEnv } from '@/interfaces/http/types';
import { configureOpenAPI } from '@/lib/openapi';

const app = new OpenAPIHono<AppEnv>();

app.use('*', secureHeaders());

app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

if (env.NODE_ENV !== 'production') {
  app.use('*', logger());
}

app.use('*', async (c, next) => {
  const container = buildContainer(c as never);
  c.set('container', container);
  c.set('logger', container.logger);
  await next();
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const auth = createAuth0Middleware({
  domain: env.AUTH0_DOMAIN,
  audience: env.AUTH0_AUDIENCE,
});

app.use('/v1/*', auth);

app.route('/v1/hello', helloApp);

configureOpenAPI(app);

app.onError(errorHandler);

export default app;
