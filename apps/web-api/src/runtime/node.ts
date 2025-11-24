import { serve } from '@hono/node-server';

import { EnvValidationError, getEnv } from '@/infrastructure/config/env';
import { cleanup as cleanupContainer } from '@/infrastructure/di/container';
import { createLogger } from '@/infrastructure/logging/Logger';
import app from '@/interfaces/http/server/app';

const logger = createLogger('app-bootstrap');

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
    error: error instanceof Error ? error.message : String(error),
  });
  console.error('❌ Unexpected error during startup:', error);
  process.exit(1);
}

const port = env.PORT;

logger.info('Starting application server', {
  port,
  nodeEnv: env.NODE_ENV,
});

console.log(`🚀 Server is running on http://localhost:${port}`);

if (env.NODE_ENV !== 'production') {
  console.log(`📚 Swagger UI is available at http://localhost:${port}/docs`);
  console.log(`📄 OpenAPI spec is available at http://localhost:${port}/openapi.json`);
}

const server = serve({
  fetch: app.fetch,
  port,
});

const shutdown = async () => {
  logger.info('Shutdown signal received, starting graceful shutdown...');
  console.log('\n🛑 Shutting down gracefully...');

  server.close(() => {
    logger.info('HTTP server closed');
    console.log('✅ HTTP server closed');
  });

  await cleanupContainer();
  logger.info('DI container cleaned up and database connection closed');
  console.log('✅ DI container cleaned up and database connection closed');

  logger.info('Application shutdown complete');
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());

// グローバルエラーハンドラー（予期しないエラー用）
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
  });
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', {
    reason: String(reason),
  });
  console.error('❌ Unhandled rejection:', reason);
  process.exit(1);
});
