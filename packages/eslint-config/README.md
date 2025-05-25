# @repo/eslint-config

共有ESLint設定パッケージです。TypeScriptプロジェクト向けのメジャーなルールが設定されています。

## 特徴

- TypeScript向けの包括的なルール設定
- React/JSX対応
- アクセシビリティルール
- インポート順序の自動整理
- テストファイル向けの特別な設定

## 使用方法

1. パッケージをインストール:
```bash
pnpm add -D @repo/eslint-config
```

2. `eslint.config.js` (Flat Config) で設定をインポート:

```javascript
import baseConfig from '@repo/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
```

### プロジェクト固有のルールを追加する場合

```javascript
import baseConfig from '@repo/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // プロジェクト固有のルールをここに追加
      'no-console': 'error', // 例: console.logを完全に禁止
    },
  }
);
```

## 含まれるルール

### TypeScript
- 未使用変数の検出
- 型安全性の向上
- 一貫した型定義スタイル
- nullish coalescing の推奨

### React
- Hooks のルール
- JSX のベストプラクティス
- アクセシビリティの基本ルール

### インポート
- インポート順序の自動整理
- 重複インポートの検出

### 一般的なJavaScript/TypeScript
- コンソールログの警告
- デバッガーの禁止
- 一貫したコーディングスタイル
