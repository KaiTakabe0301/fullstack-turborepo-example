/**
 * GetHelloUseCase Unit Test
 *
 * Demonstrates testing with InversifyJS DI container.
 * Tests are isolated by using mock dependencies.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

import { GetHelloUseCase } from '@/application/hello/use-case/GetHello';
import { HelloEntity } from '@/domain/hello/entities/Hello.entity';
import type { IHelloRepository } from '@/domain/hello/repositories/IHelloRepository';
import type { Logger } from '@/infrastructure/logging/Logger';


describe('GetHelloUseCase', () => {
  let getHelloUseCase: GetHelloUseCase;
  let mockLogger: Logger;
  let mockHelloRepository: IHelloRepository;

  beforeEach(() => {
    // Create mock dependencies
    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };

    mockHelloRepository = {
      create: vi.fn(),
      findByRequestId: vi.fn(),
      findAll: vi.fn(),
    };

    // Manual dependency injection for testing
    getHelloUseCase = new GetHelloUseCase(mockLogger, mockHelloRepository);
  });

  it('should execute successfully and return hello message', () => {
    // Arrange
    const mockEntity = HelloEntity.create('Hello from test!', 'test-request-id');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(mockHelloRepository.create).mockReturnValue(mockEntity);

    // Act
    const result = getHelloUseCase.execute('test-request-id');

    // Assert
    expect(result).toEqual({
      message: 'Hello from test!',
    });
    expect(mockLogger.info).toHaveBeenCalledWith('GetHello use case executed');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockHelloRepository.create).toHaveBeenCalledWith(
      'Hello from REST API with DI!',
      'test-request-id'
    );
  });

  it('should work without requestId', () => {
    // Arrange
    const mockEntity = HelloEntity.create('Hello from test!');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(mockHelloRepository.create).mockReturnValue(mockEntity);

    // Act
    const result = getHelloUseCase.execute();

    // Assert
    expect(result).toEqual({
      message: 'Hello from test!',
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockHelloRepository.create).toHaveBeenCalledWith(
      'Hello from REST API with DI!',
      undefined
    );
  });
});
