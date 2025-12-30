import { injectable, inject } from 'inversify';

import type { IHelloRepository } from '@/domain/hello/repositories/IHelloRepository';
import { TYPES } from '@/infrastructure/di/types';
import type { Logger } from '@/infrastructure/logging/Logger';
import type { HelloResponse } from '@/schemas/hello.schema';

@injectable()
export class GetHelloUseCase {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.IHelloRepository)
    private readonly helloRepository: IHelloRepository
  ) {}

  execute(requestId?: string): HelloResponse {
    this.logger.info('GetHello use case executed', {
      context: 'GetHelloUseCase',
      method: 'execute',
    });

    // Create a Hello entity through the repository
    const helloEntity = this.helloRepository.create(
      'Hello from REST API with DI!',
      requestId
    );

    return {
      message: helloEntity.message,
    };
  }
}
