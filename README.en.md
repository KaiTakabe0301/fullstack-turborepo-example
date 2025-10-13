# Fullstack Turborepo Example Application

This project is a sample fullstack application using the latest web development technologies. It efficiently manages frontend, backend, and shared packages using a Turborepo monorepo structure.

## 🚀 Tech Stack

### Frontend
- **Next.js 15.3** - React-based framework (with Turbopack support)
- **React 19** - UI library (latest version)
- **Apollo Client** - GraphQL client
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Fast unit testing framework
- **Storybook** - UI component development environment
- **MSW** - API mocking library

### Backend
- **NestJS** - Progressive Node.js framework
- **Apollo Server** - GraphQL server
- **Prisma** - Next-generation ORM
- **PostgreSQL 16** - Relational database
- **Jest** - Testing framework

### Build & Development Tools
- **Turborepo** - Monorepo management tool
- **pnpm** - Fast and efficient package manager
- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code quality tool
- **Prettier** - Code formatter

## 📁 Project Structure

```
fullstack-turborepo-example/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── web-api/            # NestJS GraphQL API server
├── packages/
│   ├── database/           # Prisma database configuration and shared models
│   ├── eslint-config/      # Shared ESLint configuration
│   └── prettier-config/    # Shared Prettier configuration
├── turbo.json             # Turborepo configuration
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── docker-compose.yml     # Docker configuration (PostgreSQL)
```

## 🛠️ Setup

### Prerequisites
- Node.js 18 or higher
- pnpm 9.15.1 or higher
- Docker (for database)

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd fullstack-turborepo-example
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
# Create .env file in root directory
cp .env.example .env
```

Example environment variables:
```env
# Database connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"

# PostgreSQL settings (Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mydb
```

4. **Start the database**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
pnpm db:migrate
```

## 🚀 Development

### Start development servers
```bash
pnpm dev
```

This command executes:
1. Database migrations
2. Prisma client generation
3. GraphQL schema generation
4. GraphQL code generation
5. Start development servers (Web: http://localhost:3000, API: http://localhost:3001)

### Main Commands

#### Development
```bash
pnpm dev          # Start all application development servers
pnpm build        # Build all applications
pnpm lint         # Run lint checks
pnpm test         # Run tests
```

#### Database
```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Apply schema to database
pnpm db:migrate   # Run migrations
```

#### Code Generation
```bash
pnpm generate:schema  # Generate GraphQL schema
pnpm codegen          # Generate GraphQL client code
```

### Application-specific Commands

#### Web Application (apps/web)
```bash
cd apps/web
pnpm dev              # Next.js development server (Turbopack)
pnpm build            # Production build
pnpm storybook        # Start Storybook
pnpm test             # Run Vitest tests
pnpm test:watch       # Test watch mode
pnpm test:coverage    # Generate coverage report
```

#### API Server (apps/web-api)
```bash
cd apps/web-api
pnpm dev              # NestJS development server
pnpm build            # Production build
pnpm test             # Run Jest tests
pnpm test:e2e         # Run E2E tests
pnpm generate:schema  # Generate GraphQL schema
```

## 🏗️ Architecture

### Turborepo Task Dependencies

This project uses Turborepo to manage dependencies between tasks:

```
db:generate → generate:schema → codegen → build/dev
```

1. **db:generate**: Generate Prisma client
2. **generate:schema**: Generate GraphQL schema from Prisma models
3. **codegen**: Generate TypeScript type definitions from GraphQL schema
4. **build/dev**: Build application or start development server

### Data Flow

```
PostgreSQL ↔ Prisma ↔ NestJS/GraphQL API ↔ Apollo Client ↔ Next.js/React
```

## 📡 Sample GraphQL Queries

GraphQL Playground: http://localhost:3001/graphql

```graphql
# Get all users
query GetUsers {
  users {
    id
    email
    name
    role
    createdAt
    updatedAt
  }
}

# Create user
mutation CreateUser {
  createUser(createUserInput: {
    email: "user@example.com"
    name: "Test User"
    password: "password123"
    role: USER
  }) {
    id
    email
    name
    role
  }
}

# Update user
mutation UpdateUser {
  updateUser(
    id: "user-id-here"
    updateUserInput: {
      name: "Updated Name"
    }
  ) {
    id
    name
  }
}

# Delete user
mutation RemoveUser {
  removeUser(id: "user-id-here") {
    id
  }
}
```

## 🧪 Testing

### Frontend Testing
- **Vitest**: Fast unit testing
- **React Testing Library**: Component testing
- **MSW**: API mocking

### Backend Testing
- **Jest**: Unit and integration testing
- **Supertest**: E2E testing

## 📦 Deployment

Create production build:
```bash
pnpm build
```

Each application can be deployed independently:
- **Web**: Vercel, Netlify, or other static hosting services
- **API**: Heroku, AWS, Google Cloud Run, or other container-compatible services

## 🔧 Extensibility

This boilerplate is structured to easily add new applications and services:

```bash
# Example new web app
apps/admin/           # Admin panel frontend
apps/admin-api/       # Admin panel API

# Example new services
apps/mobile-api/      # Mobile app API
apps/scheduler/       # Background job scheduler

# Example new shared packages
packages/ui/          # Shared UI component library
packages/types/       # Shared TypeScript type definitions
packages/utils/       # Shared utility functions
```

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.