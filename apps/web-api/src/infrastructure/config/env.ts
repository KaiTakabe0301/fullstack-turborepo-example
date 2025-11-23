import { z } from 'zod';

import { createLogger } from '@/infrastructure/logging/Logger';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'staging', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(0).max(65535).default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  AUTH0_DOMAIN: z.string().min(1),
  AUTH0_AUDIENCE: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

export class EnvValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: z.ZodError
  ) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

export function validateEnv(): Env {
  const logger = createLogger('env-validation');

  logger.info('Validating environment variables...');

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.format();

    // 詳細なエラーメッセージを構築
    const missingVars: string[] = [];
    const invalidVars: string[] = [];

    Object.entries(errorDetails).forEach(([key, value]) => {
      if (key === '_errors') {
        return;
      }

      const errors = (value as { _errors?: string[] })?._errors;
      if (errors?.includes('Required')) {
        missingVars.push(key);
      } else if (errors && errors.length > 0) {
        invalidVars.push(`${key}: ${errors.join(', ')}`);
      }
    });

    const errorMessage = [
      '❌ Environment variable validation failed',
      missingVars.length > 0 && `Missing variables: ${missingVars.join(', ')}`,
      invalidVars.length > 0 && `Invalid variables: ${invalidVars.join('; ')}`,
    ]
      .filter(Boolean)
      .join('\n');

    const envValidationError = new EnvValidationError(
      errorMessage,
      result.error
    );

    logger.error('Failed to start application: Invalid environment variables', {
      error: envValidationError.message,
    });

    throw envValidationError;
  }

  logger.info('Environment variables validated successfully', {
    nodeEnv: result.data.NODE_ENV,
    port: result.data.PORT,
  });

  return result.data;
}

// 遅延評価: runtime/node.tsから明示的に呼び出す
let cachedEnv: Env | null = null;

export function getEnv(): Env {
  cachedEnv ??= validateEnv();
  return cachedEnv;
}
