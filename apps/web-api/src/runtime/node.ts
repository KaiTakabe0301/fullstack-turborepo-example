import { serve } from '@hono/node-server';

import { EnvValidationError, getEnv } from '@/infrastructure/config/env';
import { cleanup as cleanupContainer } from '@/infrastructure/di/container';
import { createLogger } from '@/infrastructure/logging/Logger';
import app from '@/interfaces/http/server/app';

// Get package info for logging
const packageName = process.env.npm_package_name ?? 'web-api';
const packageVersion = process.env.npm_package_version ?? '0.0.0';

const logger = createLogger({
  correlationId: crypto.randomUUID(),
  context: 'app-bootstrap',
  serviceName: packageName,
  serviceVersion: packageVersion,
  environment: process.env.NODE_ENV ?? 'development',
});

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
