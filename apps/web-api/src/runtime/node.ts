import { serve } from '@hono/node-server';

import { env } from '@/infrastructure/config/env';
import { disconnectPrisma } from '@/infrastructure/persistence/prisma/PrismaClient';
import app from '@/interfaces/http/server/app';

const port = env.PORT;

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
  console.log('\n🛑 Shutting down gracefully...');

  server.close(() => {
    console.log('✅ HTTP server closed');
  });

  await disconnectPrisma();
  console.log('✅ Database connection closed');

  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
