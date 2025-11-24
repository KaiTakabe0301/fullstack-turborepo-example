/**
 * HelloRepository Unit Test
 *
 * Tests the repository implementation with mocked PrismaClient.
 */

import type { PrismaClient } from '@prisma/client';
import { describe, it, expect, beforeEach } from 'vitest';

import { HelloEntity } from '@/domain/hello/entities/Hello.entity';
import { HelloRepository } from '@/infrastructure/persistence/repositories/HelloRepository';


describe('HelloRepository', () => {
  let helloRepository: HelloRepository;
  let mockPrismaClient: PrismaClient;

  beforeEach(() => {
    // Create mock PrismaClient
    mockPrismaClient = {} as PrismaClient;

    // Manual dependency injection for testing
    helloRepository = new HelloRepository(mockPrismaClient);
  });

  it('should create a HelloEntity', () => {
    // Act
    const result = helloRepository.create('Test message', 'test-id');

    // Assert
    expect(result).toBeInstanceOf(HelloEntity);
    expect(result.message).toBe('Test message');
    expect(result.requestId).toBe('test-id');
  });

  it('should create a HelloEntity without requestId', () => {
    // Act
    const result = helloRepository.create('Test message');

    // Assert
    expect(result).toBeInstanceOf(HelloEntity);
    expect(result.message).toBe('Test message');
    expect(result.requestId).toBeUndefined();
  });

  it('should return null for findByRequestId', () => {
    // Act
    const result = helloRepository.findByRequestId('test-id');

    // Assert
    expect(result).toBeNull();
  });

  it('should return empty array for findAll', () => {
    // Act
    const result = helloRepository.findAll();

    // Assert
    expect(result).toEqual([]);
  });
});
