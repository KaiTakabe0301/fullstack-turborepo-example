import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: '../web-api/tsp-output/@typespec/openapi3/openapi.json',
    },
    output: {
      workspace: 'src/lib/api/gen',
      target: './endpoints',
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
          path: '../fetcher.ts',
          name: 'customFetch',
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
});
