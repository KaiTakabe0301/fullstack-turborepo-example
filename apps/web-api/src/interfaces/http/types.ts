import type { Container } from 'inversify';
import type { JWTPayload } from 'jose';

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
  };
}
