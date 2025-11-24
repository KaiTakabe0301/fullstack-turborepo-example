/**
 * InversifyJS Container Configuration
 *
 * This file configures all dependency bindings for the application.
 * It follows the Dependency Inversion Principle by binding interfaces to implementations.
 */

import 'reflect-metadata';
import type { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

import { GetHelloUseCase } from '@/application/hello/use-case/GetHello';
import type { IHelloRepository } from '@/domain/hello/repositories/IHelloRepository';
import { TYPES } from '@/infrastructure/di/types';
import { createLogger, type Logger } from '@/infrastructure/logging/Logger';
import { getPrismaClient } from '@/infrastructure/persistence/prisma/PrismaClient';
import { HelloRepository } from '@/infrastructure/persistence/repositories/HelloRepository';

// Infrastructure

// Domain - Repositories

// Application - Use Cases

/**
 * Create and configure the DI container
 */
export function createContainer(): Container {
  const container = new Container({
    defaultScope: 'Singleton',
    skipBaseClassChecks: true,
  });

  // ========================================
  // Infrastructure Layer
  // ========================================

  // Singleton: PrismaClient - shared across all requests
  container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(getPrismaClient());

  // Request-scoped: Logger - unique instance per request with requestId
  // Note: This will be overridden in middleware for request-scoped instances
  container.bind<Logger>(TYPES.Logger).toDynamicValue(() => {
    return createLogger();
  });

  // ========================================
  // Domain Layer - Repositories
  // ========================================

  container.bind<IHelloRepository>(TYPES.IHelloRepository).to(HelloRepository);

  // ========================================
  // Application Layer - Use Cases
  // ========================================

  container.bind<GetHelloUseCase>(TYPES.GetHelloUseCase).to(GetHelloUseCase);

  return container;
}

/**
 * Cleanup resources when shutting down
 */
export async function cleanupContainer(container: Container): Promise<void> {
  const prisma = container.get<PrismaClient>(TYPES.PrismaClient);
  await prisma.$disconnect();
}
