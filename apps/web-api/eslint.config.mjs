import baseConfig from '@repo/eslint-config/base';

export default [
  ...baseConfig,
  {
    ignores: ['dist/', 'node_modules/', 'src/schema.gql'],
  },
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];