import { serve } from '@hono/node-server';

import { EnvValidationError, getEnv } from '@/infrastructure/config/env';
import { cleanup as cleanupContainer } from '@/infrastructure/di/container';
import { createLogger } from '@/infrastructure/logging/Logger';
import app from '@/interfaces/http/server/app';

// Get package info for logging
const packageName = process.env.npm_package_name ?? 'web-api';
const packageVersion = process.env.npm_package_version ?? '0.0.0';

// Define global state for hot-reload detection (shared across module reloads)
declare global {
  // eslint-disable-next-line no-var
  var __hotReloadState:
    | {
        server?: ReturnType<typeof serve>;
        isCleaningUp?: boolean;
      }
    | undefined;
}

// Initialize global state
global.__hotReloadState ??= {};

const logger = createLogger({
  correlationId: crypto.randomUUID(),
  context: 'app-bootstrap',
  serviceName: packageName,
  serviceVersion: packageVersion,
  environment: process.env.NODE_ENV ?? 'development',
});

// Detect hot-reload and cleanup old resources
if (global.__hotReloadState.server && !global.__hotReloadState.isCleaningUp) {
  logger.info('Hot-reload detected, cleaning up old resources');
  global.__hotReloadState.isCleaningUp = true;

  try {
    // Close old server to release port
    global.__hotReloadState.server.close();
    logger.debug('Old HTTP server closed');

    // Cleanup DI container and Prisma connections
    await cleanupContainer();
    logger.debug('Old DI container cleaned up');

    logger.info('Old resources cleaned up successfully');
  } catch (error) {
    logger.warn('Error during hot-reload cleanup', {
      err: error instanceof Error ? error : new Error(String(error)),
    });
  } finally {
    global.__hotReloadState.isCleaningUp = false;
  }
}

// アプリ起動前に環境変数をバリデーション
let env;
try {
  env = getEnv();
} catch (error) {
  if (error instanceof EnvValidationError) {
    process.exit(1);
  }

  // 予期しないエラー
  logger.error('Failed to start application: Unexpected error', {
    err: error instanceof Error ? error : new Error(String(error)),
  });
  process.exit(1);
}

const port = env.PORT;

const server = serve({
  fetch: app.fetch,
  port,
});

// Store server in global state for next hot-reload
global.__hotReloadState.server = server;

logger.info('Server started successfully', {
  port,
  nodeEnv: env.NODE_ENV,
  swaggerUiUrl: env.NODE_ENV !== 'production' ? `http://localhost:${port}/docs` : undefined,
  openapiUrl: env.NODE_ENV !== 'production' ? `http://localhost:${port}/openapi.json` : undefined,
});

const shutdown = async () => {
  logger.info('Shutdown signal received, starting graceful shutdown');

  server.close(() => {
    logger.info('HTTP server closed');
  });

  await cleanupContainer();
  logger.info('DI container cleaned up and database connection closed');

  logger.info('Application shutdown complete');
  process.exit(0);
};

// Remove existing listeners to prevent accumulation during hot-reload
process.removeAllListeners('SIGTERM');
process.removeAllListeners('SIGINT');
process.removeAllListeners('uncaughtException');
process.removeAllListeners('unhandledRejection');

// Register signal handlers for graceful shutdown
process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());

// グローバルエラーハンドラー（予期しないエラー用）
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    err: error,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', {
    err: reason instanceof Error ? reason : new Error(String(reason)),
  });
  process.exit(1);
});
