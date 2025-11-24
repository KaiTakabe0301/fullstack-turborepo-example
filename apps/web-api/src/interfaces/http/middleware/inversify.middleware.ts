/**
 * InversifyJS Middleware for Hono
 *
 * This middleware integrates InversifyJS container with Hono context.
 * It creates a child container for each request to handle request-scoped dependencies.
 */

import type { Context, MiddlewareHandler } from 'hono';
import type { Container } from 'inversify';

import { getContainer } from '@/infrastructure/di/container';
import { TYPES } from '@/infrastructure/di/types';
import { createLogger, type Logger } from '@/infrastructure/logging/Logger';
import type { AppEnv } from '@/interfaces/http/types';

/**
 * Middleware to provide InversifyJS container in Hono context
 */
export function inversifyMiddleware(): MiddlewareHandler<AppEnv> {
  const rootContainer = getContainer();

  return async (c: Context<AppEnv>, next) => {
    // Create a child container for request-scoped dependencies
    const requestContainer = rootContainer.createChild();

    // Generate unique request ID
    const requestId = crypto.randomUUID();

    // Override Logger binding with request-scoped instance
    requestContainer.rebind<Logger>(TYPES.Logger).toConstantValue(
      createLogger(requestId)
    );

    // Store container in Hono context
    c.set('container', requestContainer);

    await next();
  };
}

/**
 * Type-safe helper to get container from context
 */
export function getContainerFromContext(c: Context<AppEnv>): Container {
  const container = c.get('container');
  if (!container) {
    throw new Error('Container not found in context. Ensure inversifyMiddleware is configured.');
  }
  return container;
}
