# @repo/eslint-config

共有ESLint設定パッケージです。TypeScriptプロジェクト向けの包括的なルール設定を提供し、ベース設定とReact専用設定に分離されています。

## 設定の種類

### 1. ベース設定 (`@repo/eslint-config/base`)
- TypeScript向けの基本ルール
- Node.js環境対応
- インポート順序の自動整理
- テストファイル向けの設定
- **バックエンドプロジェクトに最適**

### 2. React設定 (`@repo/eslint-config/react`)
- ベース設定を継承
- React/JSXのベストプラクティス
- アクセシビリティルール
- **フロントエンドプロジェクトに最適**

### 3. デフォルト設定 (`@repo/eslint-config`)
- 後方互換性のためReact設定と同じ
- 既存プロジェクトはそのまま使用可能

## 使用方法

### バックエンドプロジェクト（ベース設定のみ）

```javascript
import baseConfig from '@repo/eslint-config/base';
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

### フロントエンドプロジェクト（React設定）

```javascript
import reactConfig from '@repo/eslint-config/react';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...reactConfig,
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

### 従来通りの使用方法（後方互換性）

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

## 含まれるルール

### ベース設定
- **TypeScript**: 型安全性、未使用変数検出、一貫した型定義スタイル
- **インポート**: インポート順序の自動整理、重複インポートの検出
- **一般的なJavaScript/TypeScript**: コンソールログの警告、デバッガーの禁止、一貫したコーディングスタイル
- **テストファイル**: Jest/Vitest対応のグローバル変数設定

### React設定（ベース設定に追加）
- **React Hooks**: Hooksのルール
- **JSX**: JSXのベストプラクティス
- **アクセシビリティ**: 基本的なa11yルール

## プロジェクト構成例

```
packages/
├── eslint-config/
│   ├── base.js      # ベース設定（バックエンド向け）
│   ├── react.js     # React設定（フロントエンド向け）
│   └── index.js     # デフォルト設定（後方互換性）
├── backend/         # ベース設定を使用
└── frontend/        # React設定を使用
```

## インストール

```bash
pnpm add -D @repo/eslint-config
```

必要に応じて、使用する設定に応じた依存関係が自動的にインストールされます。
