import { OpenAPIHono, createRoute } from '@hono/zod-openapi';

import type { GetHelloUseCase } from '@/application/hello/use-case/GetHello';
import { TYPES } from '@/infrastructure/di/types';
import { getContainerFromContext } from '@/interfaces/http/middleware/inversify.middleware';
import type { AppEnv } from '@/interfaces/http/types';
import { ErrorResponseSchema } from '@/schemas/error.schema';
import { HelloResponseSchema } from '@/schemas/hello.schema';

export const helloApp = new OpenAPIHono<AppEnv>();

const getHelloRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Hello'],
  operationId: 'getHello',
  summary: 'Get hello message',
  description: 'Returns a hello message. Requires JWT Bearer authentication.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HelloResponseSchema,
        },
      },
      description: 'Successful response',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Unauthorized',
    },
  },
  security: [{ bearerAuth: [] }],
});

helloApp.openapi(getHelloRoute, (c) => {
  const container = getContainerFromContext(c);
  const getHelloUseCase = container.get<GetHelloUseCase>(TYPES.GetHelloUseCase);

  const result = getHelloUseCase.execute();

  return c.json(result, 200);
});
