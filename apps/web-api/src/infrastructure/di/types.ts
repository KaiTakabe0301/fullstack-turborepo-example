/**
 * Dependency Injection Tokens
 *
 * Symbol-based tokens for type-safe dependency injection with InversifyJS.
 * Using Symbol.for() ensures tokens are globally unique and serializable.
 */

export const TYPES = {
  // Infrastructure Layer
  PrismaClient: Symbol.for('PrismaClient'),
  Logger: Symbol.for('Logger'),

  // Domain Layer - Repositories
  IHelloRepository: Symbol.for('IHelloRepository'),

  // Application Layer - Use Cases
  GetHelloUseCase: Symbol.for('GetHelloUseCase'),
} as const;

// Type-safe token keys
export type TokenType = typeof TYPES[keyof typeof TYPES];
