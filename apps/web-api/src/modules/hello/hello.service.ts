import { Injectable } from '@nestjs/common';

import { HelloApi } from '@/generated/api';
import { HelloResponse } from '@/generated/models';

/**
 * HelloService implements the HelloApi contract generated from OpenAPI spec.
 * This service contains the business logic for hello operations.
 */
@Injectable()
export class HelloService extends HelloApi {
  /**
   * Returns a hello message
   * @param _request - Express request object (unused but required by contract)
   * @returns HelloResponse containing the greeting message
   */
  helloGetHello(_request: Request): HelloResponse {
    return {
      message: 'Hello from REST API!',
    };
  }
}
