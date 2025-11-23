import { swaggerUI } from '@hono/swagger-ui';
import type { OpenAPIHono } from '@hono/zod-openapi';

import type { AppEnv } from '@/interfaces/http/types';

export function configureOpenAPI(app: OpenAPIHono<AppEnv>) {
  app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Auth0 JWT access token',
  });

  app.doc31('/openapi.json', {
    openapi: '3.1.0',
    info: {
      title: 'Web API',
      version: '1.0.0',
      description: 'Web API REST API documentation with Auth0 authentication',
      contact: {
        name: 'API Support',
        email: 'api@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/v1',
        description: 'Development server',
      },
    ],
    security: [{ bearerAuth: [] }],
  });

  if (process.env.NODE_ENV !== 'production') {
    app.get('/docs', swaggerUI({ url: '/openapi.json' }));
  }

  return app;
}
