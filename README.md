# Fullstack Turborepo Example

A modern fullstack boilerplate featuring TypeScript, Monorepo, NestJS, GraphQL, Prisma, and PostgreSQL.

## Tech Stack

### Monorepo & Build Tools

- **Turborepo** 2.5.3 - High-performance build system for JavaScript/TypeScript monorepos
- **pnpm** 9.15.1 - Fast, disk space efficient package manager

### Frontend (apps/web)

- **Next.js** 15.3.2 - React framework with App Router
- **React** 19.1.0 - UI library
- **TypeScript** 5.8.3 - Type-safe JavaScript
- **Apollo Client** 4.0.7 - GraphQL client with caching
- **GraphQL Code Generator** 5.0.3 - Type-safe GraphQL operations
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **Storybook** 9.1.10 - UI component development environment
- **Vitest** 3.1.4 - Fast unit test framework
- **React Testing Library** 16.3.0 - React component testing utilities
- **MSW** 2.8.4 - API mocking for testing

### Backend (apps/web-api)

- **NestJS** 10.4.9 - Progressive Node.js framework
- **Apollo Server** 4.11.2 - GraphQL server
- **GraphQL** 16.10.0 - Query language for APIs
- **TypeScript** 5.7.3 - Type-safe JavaScript
- **Prisma** 5.22.0 - Next-generation ORM
- **Jest** 29.7.0 - JavaScript testing framework

### Database

- **PostgreSQL** 16-alpine - Powerful, open source relational database
- **Prisma** 5.22.0 - Database toolkit and ORM

### Development Tools

- **ESLint** - JavaScript/TypeScript linter with custom shared configs
- **Prettier** - Code formatter with shared configuration
- **Docker Compose** - Multi-container Docker orchestration

## Project Structure

```
.
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   │   ├── ui/        # Reusable UI components
│   │   │   │   └── domains/   # Domain-specific components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── pages/         # Next.js pages
│   │   │   ├── contexts/      # React contexts
│   │   │   ├── lib/           # Apollo Client setup
│   │   │   ├── mocks/         # MSW mock handlers
│   │   │   └── styles/        # Global styles
│   │   └── .storybook/        # Storybook configuration
│   └── web-api/               # NestJS GraphQL API
│       └── src/
│           ├── modules/       # Feature modules
│           │   ├── app/      # Main application module
│           │   ├── hello/    # Sample GraphQL module
│           │   └── prisma/   # Prisma service module
│           ├── config/        # Environment validation
│           └── generated/     # Generated GraphQL schema
├── packages/
│   ├── database/              # Shared Prisma client
│   │   └── prisma/           # Prisma schema
│   ├── eslint-config/         # Shared ESLint configuration
│   │   └── src/
│   │       ├── base.js       # Base TypeScript config
│   │       └── react.js      # React-specific config
│   └── prettier-config/       # Shared Prettier configuration
├── docker-compose.yml         # PostgreSQL setup
├── turbo.json                 # Turborepo configuration
└── pnpm-workspace.yaml        # pnpm workspace configuration
```

## Applications

### apps/web

Next.js frontend application featuring:

- Apollo Client for GraphQL queries with type-safe generated hooks
- Storybook for component development and documentation
- Comprehensive testing setup with Vitest and React Testing Library
- MSW for API mocking during development and testing
- Tailwind CSS for styling
- Theme switching (light/dark mode) with cookie persistence

### apps/web-api

NestJS GraphQL API featuring:

- Apollo Server for GraphQL endpoint
- Prisma ORM for database access
- Auto-generated GraphQL schema
- Environment variable validation
- Modular architecture with NestJS modules

## Packages

### packages/database

- Shared Prisma client configuration
- Database schema definitions
- Migration management
- Provides type-safe database access to all applications

### packages/eslint-config

- Shared ESLint configuration for TypeScript projects
- React-specific rules for frontend applications
- Enforces code quality and consistency across the monorepo

### packages/prettier-config

- Shared Prettier configuration
- Ensures consistent code formatting across all packages

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

```bash
# Copy environment files for all applications
cp packages/database/.env.example packages/database/.env
cp apps/web/.env.local.example apps/web/.env.local
cp apps/web-api/.env.example apps/web-api/.env
```

**Database Configuration** (`packages/database/.env`):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
```

**Frontend Configuration** (`apps/web/.env.local`):

- `NEXT_PUBLIC_GRAPHQL_URL` - GraphQL API endpoint (default: http://localhost:3001/graphql)

**Backend Configuration** (`apps/web-api/.env`):

- `NODE_ENV` - Environment mode (default: development)
- `PORT` - API server port (default: 3001)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)
- `DATABASE_URL` - PostgreSQL connection string (same as packages/database)

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

### 4. Start Development Servers

```bash
pnpm dev
```

This command will:

1. Run database migrations
2. Start all development servers in parallel (frontend + backend)

## Access Information

- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3001/graphql
- **Storybook**: http://localhost:6006 (run `pnpm --filter @repo/web storybook`)
- **Prisma Studio**: Run `pnpm --filter @repo/database db:studio`
