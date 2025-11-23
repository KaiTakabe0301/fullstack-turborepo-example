import type { Context } from 'hono';

import { GetHelloUseCase } from '@/application/hello/use-case/GetHello';
import { createLogger, type Logger } from '@/infrastructure/logging/Logger';
import { getPrismaClient, type PrismaClient } from '@/infrastructure/persistence/prisma/PrismaClient';
import type { AppEnv } from '@/interfaces/http/types';

export interface Container {
  logger: Logger;
  prisma: PrismaClient;
  getHelloUseCase: GetHelloUseCase;
}

export function buildContainer(_c: Context<AppEnv>): Container {
  const requestId = crypto.randomUUID();
  const logger = createLogger(requestId);
  const prisma = getPrismaClient();

  const getHelloUseCase = new GetHelloUseCase(logger);

  return {
    logger,
    prisma,
    getHelloUseCase,
  };
}
