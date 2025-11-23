import { config } from 'dotenv';
import { z } from 'zod';

// Load .env file
config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().min(0).max(65535).default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  AUTH0_DOMAIN: z.string().min(1),
  AUTH0_AUDIENCE: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
