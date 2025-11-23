import { z } from '@hono/zod-openapi';

export const HelloResponseSchema = z
  .object({
    message: z.string().min(1).openapi({ example: 'Hello from REST API!' }),
  })
  .openapi('HelloResponse');

export type HelloResponse = z.infer<typeof HelloResponseSchema>;
