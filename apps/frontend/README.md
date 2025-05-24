# Next.js Project with Full Development Stack

This is a Next.js project with TypeScript, Pages Router, and a complete development toolchain including testing, linting, formatting, and component documentation.

## Tech Stack

- **Framework**: Next.js 15 with Pages Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library
- **Component Documentation**: Storybook
- **API Mocking**: MSW (Mock Service Worker)

## Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── Button.stories.tsx
├── mocks/              # MSW mock handlers
│   ├── handlers.ts
│   ├── browser.ts
│   └── server.ts
├── pages/              # Next.js pages (Pages Router)
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   └── api/
├── styles/             # Global styles
└── test-setup.ts       # Test configuration
```

## Testing

This project uses Vitest with React Testing Library for unit testing. Tests are automatically discovered when named with `.test.tsx` or `.spec.tsx` extensions.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Storybook

Storybook is configured for component documentation and development. Stories are automatically discovered when named with `.stories.tsx` extensions.

### Running Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view Storybook.

## Mock Service Worker (MSW)

MSW is set up for API mocking during development and testing. Mock handlers are defined in `src/mocks/handlers.ts`.

### Using MSW

1. **In Tests**: MSW is automatically configured in the test setup
2. **In Browser**: Import and start the worker in your application code:

```typescript
import { worker } from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}
```

## Code Quality

### ESLint + Prettier

The project is configured with ESLint and Prettier for consistent code quality and formatting.

- ESLint configuration: `eslint.config.mjs`
- Prettier configuration: `.prettierrc`

### Pre-commit Hooks

Consider adding Husky and lint-staged for pre-commit hooks:

```bash
npm install --save-dev husky lint-staged
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Vitest](https://vitest.dev/) - fast unit test framework
- [Storybook](https://storybook.js.org/) - tool for building UI components in isolation
- [MSW](https://mswjs.io/) - API mocking library
