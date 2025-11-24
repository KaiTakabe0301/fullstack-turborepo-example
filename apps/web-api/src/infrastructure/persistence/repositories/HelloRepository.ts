/**
 * Hello Repository Implementation
 *
 * Implements IHelloRepository interface using Prisma Client.
 * This class handles all data access operations for Hello domain.
 */

import type { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'inversify';

import { HelloEntity } from '@/domain/hello/entities/Hello.entity';
import type { IHelloRepository } from '@/domain/hello/repositories/IHelloRepository';
import { TYPES } from '@/infrastructure/di/types';

@injectable()
export class HelloRepository implements IHelloRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  create(message: string, requestId?: string): HelloEntity {
    // Note: This is a demonstration. In real application, you would persist to database.
    // For now, we just create the entity without persisting it.
    // If you have a 'hellos' table in your Prisma schema, you can uncomment below:
    /*
    const hello = await this.prisma.hello.create({
      data: {
        message,
        requestId,
      },
    });

    return new HelloEntity({
      message: hello.message,
      timestamp: hello.createdAt,
      requestId: hello.requestId ?? undefined,
    });
    */

    return HelloEntity.create(message, requestId);
  }

  findByRequestId(_requestId: string): HelloEntity | null {
    // Demonstration implementation
    // In real application, query from database:
    /*
    const hello = await this.prisma.hello.findFirst({
      where: { requestId },
    });

    if (!hello) {
      return null;
    }

    return new HelloEntity({
      message: hello.message,
      timestamp: hello.createdAt,
      requestId: hello.requestId ?? undefined,
    });
    */

    // For now, return null as we don't have persistence
    return null;
  }

  findAll(): HelloEntity[] {
    // Demonstration implementation
    // In real application, query from database:
    /*
    const hellos = await this.prisma.hello.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return hellos.map(
      (hello) =>
        new HelloEntity({
          message: hello.message,
          timestamp: hello.createdAt,
          requestId: hello.requestId ?? undefined,
        })
    );
    */

    // For now, return empty array
    return [];
  }
}
