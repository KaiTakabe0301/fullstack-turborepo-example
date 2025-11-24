import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

import { TYPES } from '@/infrastructure/di/types';
import type { Logger } from '@/infrastructure/logging/Logger';
import type { AppEnv } from '@/interfaces/http/types';

export function errorHandler(err: Error, c: Context<AppEnv>) {
  // Get logger from container if available, otherwise use a fallback
  let logger: Logger | undefined;
  try {
    const container = c.get('container');
    logger = container.get<Logger>(TYPES.Logger);
  } catch {
    // Container not available (e.g., during OpenAPI generation)
    logger = undefined;
  }

  if (err instanceof HTTPException) {
    logger?.warn('HTTP Exception', {
      status: err.status,
      message: err.message,
      path: c.req.path,
    });

    return c.json(
      {
        error: getErrorCode(err.status),
        message: err.message,
      },
      err.status
    );
  }

  if (err instanceof ZodError) {
    logger?.warn('Validation Error', {
      errors: err.errors,
      path: c.req.path,
    });

    return c.json(
      {
        error: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors,
      },
      400
    );
  }

  logger?.error('Unexpected Error', {
    error: err.message,
    stack: err.stack,
    path: c.req.path,
  });

  return c.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
    500
  );
}

function getErrorCode(status: number): string {
  const codes: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_SERVER_ERROR',
  };

  return codes[status] || 'UNKNOWN_ERROR';
}
