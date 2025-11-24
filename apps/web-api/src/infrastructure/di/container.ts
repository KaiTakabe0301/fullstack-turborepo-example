/**
 * DI Container Factory
 *
 * Provides a singleton instance of the InversifyJS container
 * and utility functions for container management.
 */

import type { Container } from 'inversify';

import { createContainer, cleanupContainer } from '@/infrastructure/di/inversify.config';

let containerInstance: Container | null = null;

/**
 * Get the singleton container instance
 * Creates a new container if one doesn't exist
 */
export function getContainer(): Container {
  containerInstance ??= createContainer();
  return containerInstance;
}

/**
 * Reset the container instance
 * Useful for testing or application restart
 */
export function resetContainer(): void {
  containerInstance = null;
}

/**
 * Cleanup and disconnect all resources
 */
export async function cleanup(): Promise<void> {
  if (containerInstance) {
    await cleanupContainer(containerInstance);
    containerInstance = null;
  }
}

// Export the container instance and cleanup function
export { cleanupContainer };
