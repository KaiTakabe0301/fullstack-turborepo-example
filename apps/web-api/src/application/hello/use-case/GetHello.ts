import type { Logger } from '@/infrastructure/logging/Logger';
import type { HelloResponse } from '@/schemas/hello.schema';

export class GetHelloUseCase {
  constructor(private readonly logger: Logger) {}

  execute(): HelloResponse {
    this.logger.info('GetHello use case executed');

    return {
      message: 'Hello from REST API!',
    };
  }
}
