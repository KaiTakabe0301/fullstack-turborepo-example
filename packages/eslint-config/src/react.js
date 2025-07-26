import reactMemoPlugin from '@kaitakabe0301/eslint-plugin-react-memo';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPerfPlugin from 'eslint-plugin-react-perf';

import baseConfig from './base.js';

export default [
  // ベース設定を継承
  ...baseConfig,

  // @see: https://github.com/cvazac/eslint-plugin-react-perf
  reactPerfPlugin.configs.flat.all,

  // React専用の設定
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // React、JSX、アクセシビリティのルール
  {
    files: ['**/*.{ts,jsx,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
      react,
      'react-hooks': reactHooks,
      '@kaitakabe0301/react-memo': reactMemoPlugin.flatConfig,
    },
    rules: {
      // React rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off', // TypeScript handles this
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+

      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',

      '@kaitakabe0301/react-memo/require-usecallback': 'error',
      '@kaitakabe0301/react-memo/require-usememo': 'error',
    },
  },
];
