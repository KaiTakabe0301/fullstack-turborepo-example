import type { JWTPayload } from 'jose';

import type { Logger } from '@/infrastructure/logging/Logger';
import type { Container } from '@/interfaces/di/container';

export interface Auth0Payload extends JWTPayload {
  scope?: string;
  permissions?: string[];
}

export interface AppEnv {
  Bindings: {
    AUTH0_DOMAIN: string;
    AUTH0_AUDIENCE: string;
  };
  Variables: {
    user: Auth0Payload;
    container: Container;
    logger: Logger;
  };
}
