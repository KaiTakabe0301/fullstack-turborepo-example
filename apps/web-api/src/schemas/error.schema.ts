import { z } from '@hono/zod-openapi';

export const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({ example: 'UNAUTHORIZED' }),
    message: z.string().openapi({ example: 'Invalid token' }),
    details: z.record(z.unknown()).optional(),
  })
  .openapi('ErrorResponse');

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
