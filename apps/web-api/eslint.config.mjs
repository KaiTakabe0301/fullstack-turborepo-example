import baseConfig from '@repo/eslint-config/base';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'src/schema.gql', 'src/generated/', 'tsp-output/', '*.config.*'],
  },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disable for path aliases (@/) - they are not actually parent imports
      'import/no-relative-parent-imports': 'off',
    },
  },
];