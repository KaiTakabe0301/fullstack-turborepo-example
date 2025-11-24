/**
 * InversifyJS Middleware for Hono
 *
 * This middleware integrates InversifyJS container with Hono context.
 * It creates a child container for each request to handle request-scoped dependencies.
 */

import { getConnInfo } from '@hono/node-server/conninfo';
import type { Context, MiddlewareHandler } from 'hono';
import type { Container } from 'inversify';

import { getContainer } from '@/infrastructure/di/container';
import { TYPES } from '@/infrastructure/di/types';
import { createLogger, type Logger } from '@/infrastructure/logging/Logger';
import type { AppEnv } from '@/interfaces/http/types';

/**
 * Extract client IP address from request
 */
function extractClientIp(c: Context<AppEnv>): string {
  // Check x-forwarded-for header (for proxies/load balancers)
  const forwardedFor = c.req.header('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Check x-real-ip header (alternative proxy header)
  const realIp = c.req.header('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to ConnInfo (socket address)
  try {
    const connInfo = getConnInfo(c);
    return connInfo.remote.address ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Extract user ID from request (e.g., from JWT token)
 * This is a placeholder - implement based on your authentication strategy
 */
function extractUserId(c: Context<AppEnv>): string | undefined {
  // TODO: Extract from JWT payload or session
  // Example: const token = c.get('jwtPayload'); return token?.sub;
  return undefined;
}

/**
 * Get memory usage in MB
 */
function getMemoryUsage(): number {
  const used = process.memoryUsage();
  return Math.round(used.heapUsed / 1024 / 1024);
}

/**
 * Middleware to provide InversifyJS container in Hono context
 */
export function inversifyMiddleware(): MiddlewareHandler<AppEnv> {
  const rootContainer = getContainer();

  return async (c: Context<AppEnv>, next) => {
    // Create a child container for request-scoped dependencies
    const requestContainer = rootContainer.createChild();

    // Track request start time for performance metrics
    const startTime = Date.now();

    // Extract correlation ID from header or generate new UUID
    const correlationId =
      c.req.header('x-correlation-id') ?? crypto.randomUUID();

    // Extract client IP address
    const ipAddress = extractClientIp(c);

    // Extract user ID (if authenticated)
    const userId = extractUserId(c);

    // Get service metadata
    const serviceName = process.env.npm_package_name ?? 'web-api';
    const serviceVersion = process.env.npm_package_version ?? '0.0.0';
    const environment = process.env.NODE_ENV ?? 'development';

    // Bind Logger with request-scoped instance
    // Note: Logger is only bound in request-scoped containers, not in the root container
    requestContainer.bind<Logger>(TYPES.Logger).toConstantValue(
      createLogger({
        correlationId,
        ipAddress,
        context: c.req.path,
        userId,
        serviceName,
        serviceVersion,
        environment,
      })
    );

    // Store container in Hono context
    c.set('container', requestContainer);

    await next();

    // Calculate response time and log with performance metrics
    const responseTime = Date.now() - startTime;
    const memoryUsage = getMemoryUsage();

    // Get logger from container and log request completion
    try {
      const logger = requestContainer.get<Logger>(TYPES.Logger);
      logger.info('Request completed', {
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        responseTime,
        memoryUsage,
      });
    } catch {
      // If logger is not available, silently skip logging
      // This can happen during container cleanup
    }
  };
}

/**
 * Type-safe helper to get container from context
 */
export function getContainerFromContext(c: Context<AppEnv>): Container {
  const container = c.get('container');
  if (!container) {
    throw new Error(
      'Container not found in context. Ensure inversifyMiddleware is configured.'
    );
  }
  return container;
}
