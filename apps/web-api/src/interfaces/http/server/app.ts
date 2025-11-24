import 'reflect-metadata';
import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { createAuth0Middleware } from '@/interfaces/http/middleware/auth';
import { errorHandler } from '@/interfaces/http/middleware/errorHandler';
import { inversifyMiddleware } from '@/interfaces/http/middleware/inversify.middleware';
import { helloApp } from '@/interfaces/http/routes/hello.routes';
import type { AppEnv } from '@/interfaces/http/types';
import { configureOpenAPI } from '@/lib/openapi';

const app = new OpenAPIHono<AppEnv>();

// Helper function to check if path should skip env-dependent middleware
const isOpenAPIPath = (path: string) => {
  return path === '/openapi.json' || path === '/docs' || path === '/health';
};

app.use('*', secureHeaders());

// Runtime-portable CORS configuration using hono/adapter
// Skip for OpenAPI endpoints to avoid env() errors during spec generation
const corsConfigMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  if (isOpenAPIPath(c.req.path)) {
    return next();
  }

  const { CORS_ORIGIN } = env<{ CORS_ORIGIN: string }>(c);
  const corsInstance = cors({
    origin: CORS_ORIGIN,
    credentials: true,
  });
  return corsInstance(c, next);
});

app.use('*', corsConfigMiddleware);

// Runtime-portable logger middleware
// Skip for OpenAPI endpoints to avoid env() errors during spec generation
const loggerConfigMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  if (isOpenAPIPath(c.req.path)) {
    return next();
  }

  const { NODE_ENV } = env<{ NODE_ENV: string }>(c);
  if (NODE_ENV !== 'production') {
    const loggerInstance = logger();
    return loggerInstance(c, next);
  }
  return next();
});

app.use('*', loggerConfigMiddleware);

// InversifyJS container middleware - provides DI container in context
// Skip DI container for OpenAPI-related endpoints to avoid errors during spec generation
const diContainerMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  if (isOpenAPIPath(c.req.path)) {
    return next();
  }

  // Apply InversifyJS middleware for all other routes
  return inversifyMiddleware()(c, next);
});

app.use('*', diContainerMiddleware);

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Runtime-portable Auth0 middleware initialization
const auth0ConfigMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = env<{ AUTH0_DOMAIN: string; AUTH0_AUDIENCE: string }>(c);

  const authMiddleware = createAuth0Middleware({
    domain: AUTH0_DOMAIN,
    audience: AUTH0_AUDIENCE,
  });

  return authMiddleware(c, next);
});

app.use('/v1/*', auth0ConfigMiddleware);

app.route('/v1/hello', helloApp);

configureOpenAPI(app);

app.onError(errorHandler);

export default app;
