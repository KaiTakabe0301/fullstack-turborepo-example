import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../web-api/src/generated/schema.gql',
  documents: 'src/**/*.{ts,tsx}',
  generates: {
    'src/graphql/__generated__/': {
      preset: 'client',
      config: {
        // Apollo Client用の設定
        useTypeImports: true,
        // カスタムスカラー型のマッピング
        scalars: {
          Date: 'DateString',
        },
      },
    },
    'src/graphql/__generated__/index.ts': {
      plugins: [
        {
          add: {
            content: `/* eslint-disable */
export * from "@/graphql/__generated__/fragment-masking";
export * from "@/graphql/__generated__/gql";`,
          },
        },
      ],
    },
  },
};

export default config;
