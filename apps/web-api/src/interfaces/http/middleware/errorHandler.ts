import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

import { TYPES } from '@/infrastructure/di/types';
import type { Logger } from '@/infrastructure/logging/Logger';
import type { AppEnv } from '@/interfaces/http/types';

export function errorHandler(err: Error, c: Context<AppEnv>) {
  // Get logger from container if available, otherwise use a fallback
  let logger: Logger | undefined;
  let requestId: string | undefined;

  try {
    const container = c.get('container');
    logger = container.get<Logger>(TYPES.Logger);
  } catch (containerError) {
    // Container not available (e.g., during OpenAPI generation)
    // Log the container retrieval failure for debugging
    console.error('[ERROR HANDLER] Failed to get logger from DI container:', {
      containerError: containerError instanceof Error ? containerError.message : 'Unknown error',
      path: c.req.path,
    });
    logger = undefined;
  }

  // Helper function to ensure logging happens even if DI logger is unavailable
  const ensureLogged = (level: 'warn' | 'error', message: string, meta: Record<string, unknown>) => {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      path: c.req.path,
      method: c.req.method,
      requestId,
      ...meta,
    };

    if (logger) {
      logger[level](message, meta);
    } else {
      // Fallback to console logging when DI logger is unavailable
      if (process.env.NODE_ENV === 'production') {
        console.error(JSON.stringify(logData));
      } else {
        console.error(`[FALLBACK ${level.toUpperCase()}] ${message}`, logData);
      }
    }
  };

  if (err instanceof HTTPException) {
    ensureLogged('warn', 'HTTP Exception', {
      status: err.status,
      message: err.message,
    });

    return c.json(
      {
        error: getErrorCode(err.status),
        message: err.message,
        ...(process.env.NODE_ENV !== 'production' && requestId ? { requestId } : {}),
      },
      err.status
    );
  }

  if (err instanceof ZodError) {
    ensureLogged('warn', 'Validation Error', {
      errors: err.errors,
    });

    return c.json(
      {
        error: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors,
        ...(process.env.NODE_ENV !== 'production' && requestId ? { requestId } : {}),
      },
      400
    );
  }

  // Log unexpected errors with full details
  ensureLogged('error', 'Unexpected Error', {
    error: err.message,
    stack: err.stack,
    errorName: err.name,
  });

  return c.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && requestId ? { requestId } : {}),
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
