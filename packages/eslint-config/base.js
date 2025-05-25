import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  // Base configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Global settings
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },

  // TypeScript and general rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // TypeScript specific rules
      // 使用されていない変数をエラーとする（_で始まる引数は除外）
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // any型の使用を警告
      '@typescript-eslint/no-explicit-any': 'warn',
      // 関数の戻り値の型注釈を強制しない
      '@typescript-eslint/explicit-function-return-type': 'off',
      // モジュール境界での型注釈を強制しない
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // non-null assertion operator (!) の使用を警告
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // 再代入されない変数にはconstを使用することを強制
      'prefer-const': 'error',
      // require()の使用をエラーとする（ES6 importを推奨）
      '@typescript-eslint/no-var-requires': 'error',
      // @ts-ignore等のTSコメントの使用を警告
      '@typescript-eslint/ban-ts-comment': 'warn',
      // 空の関数を警告
      '@typescript-eslint/no-empty-function': 'warn',
      // 推論可能な型注釈をエラーとする
      '@typescript-eslint/no-inferrable-types': 'error',
      // as constの使用を推奨
      '@typescript-eslint/prefer-as-const': 'error',
      // nullish coalescing operator (??) の使用を推奨
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      // optional chaining (?.) の使用を推奨
      '@typescript-eslint/prefer-optional-chain': 'error',
      // type定義よりもinterface定義を推奨
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      // 型のみのimportにはtype修飾子を使用することを強制
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],

      // General ESLint rules
      // console.logの使用を警告
      'no-console': 'warn',
      // debuggerの使用をエラーとする
      'no-debugger': 'error',
      // 重複したimportをエラーとする
      'no-duplicate-imports': 'error',
      // 未使用の式をエラーとする
      'no-unused-expressions': 'error',
      // varの使用をエラーとする（let/constを推奨）
      'no-var': 'error',
      // オブジェクトの省略記法を強制
      'object-shorthand': 'error',
      // アロー関数の使用を推奨
      'prefer-arrow-callback': 'error',
      // テンプレートリテラルの使用を推奨
      'prefer-template': 'error',
      // 厳密等価演算子（===）の使用を強制
      'eqeqeq': ['error', 'always'],
      // if文等で波括弧の使用を強制
      'curly': ['error', 'all'],

      // Import rules
      // importの順序を強制（builtin → external → internal → parent → sibling → index）
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // 重複したimportをエラーとする
      'import/no-duplicates': 'error',
      // 解決できないimportのチェックを無効化（TypeScriptが処理）
      'import/no-unresolved': 'off', // TypeScript handles this
    },
  },

  // JavaScript files override
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      // JSファイルではrequire()の使用を許可
      '@typescript-eslint/no-var-requires': 'off',
      // JSファイルでは関数の戻り値型注釈を強制しない
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Test files override
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        vi: 'readonly',
        vitest: 'readonly',
      },
    },
    rules: {
      // テストファイルではany型の使用を許可
      '@typescript-eslint/no-explicit-any': 'off',
      // テストファイルではnon-null assertionを許可
      '@typescript-eslint/no-non-null-assertion': 'off',
      // テストファイルではconsole.logを許可
      'no-console': 'off',
    },
  },

  // Configuration files override
  {
    files: ['**/*.config.{js,ts}', '**/.*rc.{js,ts}'],
    rules: {
      // 設定ファイルではrequire()の使用を許可
      '@typescript-eslint/no-var-requires': 'off',
      // 設定ファイルではconsole.logを許可
      'no-console': 'off',
    },
  }
);
