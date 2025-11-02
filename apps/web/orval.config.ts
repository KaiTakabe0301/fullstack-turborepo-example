// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
  // ---------------------------
  // ① React Query Hooks（Client）
  // ---------------------------
  clientHooks: {
    input: {
      target: '../web-api/tsp-output/@typespec/openapi3/openapi.json',
    },
    output: {
      workspace: 'src/lib/api/gen',
      target: './endpoints/client',
      schemas: './models',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'tags-split',
      namingConvention: 'kebab-case',
      mock: true,
      baseUrl: '',
      indexFiles: true,
      override: {
        mutator: {
          path: '../../fetcher/safe-fetch-client.ts',
          name: 'safeFetchClient',
        },
        query: {
          useQuery: true,
          options: {
            staleTime: 30000,
            refetchOnWindowFocus: false,
          },
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },

  // ---------------------------
  // ② Server SDK（Server Actions / Route Handlers）
  // ---------------------------
  serverSdk: {
    input: {
      target: '../web-api/tsp-output/@typespec/openapi3/openapi.json',
    },
    output: {
      workspace: 'src/lib/api/gen',
      target: './endpoints/server',
      schemas: './models',
      client: 'fetch',
      mode: 'tags-split',
      namingConvention: 'kebab-case',
      mock: false,
      baseUrl: '',
      indexFiles: true,
      override: {
        mutator: {
          path: '../../fetcher/safe-fetch-auth.ts',
          name: 'safeFetchAuth',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
