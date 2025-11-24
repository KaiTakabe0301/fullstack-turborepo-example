/**
 * Hello Repository Interface
 *
 * Defines the contract for data access operations related to Hello domain.
 * This interface allows the domain layer to remain independent of infrastructure concerns.
 */

import type { HelloEntity } from '@/domain/hello/entities/Hello.entity';

export interface IHelloRepository {
  /**
   * Create and persist a new Hello entity
   */
  create(message: string, requestId?: string): HelloEntity;

  /**
   * Find a Hello entity by its request ID
   */
  findByRequestId(requestId: string): HelloEntity | null;

  /**
   * Get all Hello entities
   */
  findAll(): HelloEntity[];
}
