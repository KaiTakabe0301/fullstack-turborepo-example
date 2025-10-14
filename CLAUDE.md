# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a Turborepo monorepo with a NestJS GraphQL backend and Next.js frontend. The codebase follows a type-safe, code-first approach where the backend generates GraphQL schemas that are consumed by the frontend via code generation.

### Critical Architecture Patterns

**GraphQL Type Generation Flow:**
1. Backend defines GraphQL resolvers and types using NestJS decorators
2. `apps/web-api` generates schema.gql via `scripts/generate-schema.ts`
3. `apps/web` consumes schema.gql and generates TypeScript types via GraphQL Code Generator
4. Frontend uses generated types for type-safe queries/mutations

This flow is enforced by Turborepo task dependencies:
- `@repo/web#codegen` depends on `@repo/web-api#generate:schema`
- `generate:schema` depends on `@repo/database#db:generate`
- `build` and `dev` tasks depend on `@repo/web#codegen`

**Shared Database Package:**
The `@repo/database` package provides a centralized Prisma client used by both backend and potentially other services. This ensures consistent database access and schema management.

## Development Commands

### Initial Setup
```bash
# Install all dependencies
pnpm install

# Copy environment files
cp packages/database/.env.example packages/database/.env
cp apps/web/.env.local.example apps/web/.env.local
cp apps/web-api/.env.example apps/web-api/.env

# Start PostgreSQL
docker-compose up -d

# Run migrations and start all dev servers
pnpm dev
```

### Common Development Tasks

```bash
# Start development servers (runs migrations, codegen, then starts web + web-api)
pnpm dev

# Build all apps (runs codegen first)
pnpm build

# Run all tests
pnpm test

# Run all linters
pnpm lint

# Regenerate GraphQL schema and types (backend schema → frontend types)
pnpm codegen
```

### Frontend-Specific Commands (apps/web)

```bash
# Run dev server only (requires backend running)
pnpm --filter @repo/web dev

# Run tests
pnpm --filter @repo/web test
pnpm --filter @repo/web test:watch
pnpm --filter @repo/web test:coverage

# Type checking
pnpm --filter @repo/web check-types

# Run single test file
pnpm --filter @repo/web test -- path/to/test.test.tsx

# Storybook
pnpm --filter @repo/web storybook          # Dev mode on :6006
pnpm --filter @repo/web build-storybook    # Build static

# GraphQL codegen (watch mode)
pnpm --filter @repo/web codegen:watch

# Linting
pnpm --filter @repo/web lint
pnpm --filter @repo/web lint:fix
```

### Backend-Specific Commands (apps/web-api)

```bash
# Run dev server only
pnpm --filter @repo/web-api dev

# Generate GraphQL schema file
pnpm --filter @repo/web-api generate:schema

# Run tests
pnpm --filter @repo/web-api test
pnpm --filter @repo/web-api test:watch
pnpm --filter @repo/web-api test:cov

# Run single test file
pnpm --filter @repo/web-api test -- path/to/test.spec.ts

# E2E tests
pnpm --filter @repo/web-api test:e2e
```

### Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes to database (dev only)
pnpm db:push

# Create and run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm --filter @repo/database db:studio

# Run database seed
pnpm --filter @repo/database db:seed
```

## Key Technical Details

### Frontend (apps/web)

- **Framework**: Next.js 15 with App Router
- **GraphQL Client**: Apollo Client 4.0.7 configured in `src/lib/apollo-client.ts`
- **Code Generation**: GraphQL Code Generator creates type-safe hooks from `src/**/*.{ts,tsx}` GraphQL documents
- **Generated Types Location**: `src/graphql/__generated__/`
- **Testing**: Vitest + React Testing Library + MSW for API mocking
- **Component Development**: Storybook with Vitest integration
- **Styling**: Tailwind CSS with `tailwind-merge` and `tailwind-variants`

### Backend (apps/web-api)

- **Framework**: NestJS 10.4.9 with Apollo Server
- **Architecture**: Module-based structure in `src/modules/`
  - `app/`: Main application module that imports all feature modules
  - `prisma/`: Prisma service module for database access
  - `hello/`: Example GraphQL module
- **Schema Generation**: Code-first approach using NestJS decorators, schema output to `src/generated/schema.gql`
- **Database**: Prisma ORM with shared `@repo/database` package
- **Testing**: Jest with NestJS testing utilities

### Monorepo Packages

- **@repo/database**: Shared Prisma client and schema
- **@repo/eslint-config**: Shared ESLint configurations (`base.js` for TypeScript, `react.js` for React)
- **@repo/prettier-config**: Shared Prettier configuration

## Important Notes

### GraphQL Development Workflow

When making GraphQL changes:
1. Modify resolver/types in `apps/web-api/src/modules/`
2. Run `pnpm --filter @repo/web-api generate:schema` to update schema.gql
3. Run `pnpm --filter @repo/web codegen` to regenerate frontend types
4. Use generated types in frontend components

Or simply run `pnpm codegen` at root to do all steps.

### Database Migrations

Always use migrations in team environments:
```bash
pnpm db:migrate  # Creates migration and applies it
```

Only use `db:push` for rapid prototyping:
```bash
pnpm db:push  # Syncs schema without migration files
```

### Testing Guidelines

Frontend tests should:
- Mock Apollo Client queries/mutations using MSW
- Test components in isolation by mocking custom hooks
- Use `@testing-library/react` utilities
- Follow patterns in existing test files

Backend tests should:
- Use NestJS testing utilities for module/integration tests
- Mock Prisma client for unit tests
- Use `supertest` for E2E tests

### Turborepo Task Execution

Turborepo automatically handles task dependencies. When you run `pnpm dev`:
1. Database migrations run first
2. GraphQL schema generation runs
3. Frontend codegen runs
4. Both dev servers start in parallel

This ensures type safety across the stack without manual intervention.
