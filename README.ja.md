# Fullstack Turborepo Example

TypeScript + Monorepo + NestJS + GraphQL + Prisma + PostgreSQL を使用したモダンなフルスタックボイラープレート

## 技術スタック

### Monorepo & ビルドツール

- **Turborepo** 2.5.3 - JavaScript/TypeScript monorepo 用の高性能ビルドシステム
- **pnpm** 9.15.1 - 高速でディスクスペース効率の良いパッケージマネージャー

### フロントエンド (apps/web)

- **Next.js** 15.3.2 - App Router を搭載した React フレームワーク
- **React** 19.1.0 - UI ライブラリ
- **TypeScript** 5.8.3 - 型安全な JavaScript
- **Apollo Client** 4.0.7 - キャッシュ機能を備えた GraphQL クライアント
- **GraphQL Code Generator** 5.0.3 - 型安全な GraphQL オペレーション生成
- **Tailwind CSS** 3.4.17 - ユーティリティファースト CSS フレームワーク
- **Storybook** 9.1.10 - UI コンポーネント開発環境
- **Vitest** 3.1.4 - 高速なユニットテストフレームワーク
- **React Testing Library** 16.3.0 - React コンポーネントテストユーティリティ
- **MSW** 2.8.4 - テスト用 API モッキング

### バックエンド (apps/web-api)

- **NestJS** 10.4.9 - プログレッシブな Node.js フレームワーク
- **Apollo Server** 4.11.2 - GraphQL サーバー
- **GraphQL** 16.10.0 - API 用クエリ言語
- **TypeScript** 5.7.3 - 型安全な JavaScript
- **Prisma** 5.22.0 - 次世代 ORM
- **Jest** 29.7.0 - JavaScript テストフレームワーク

### データベース

- **PostgreSQL** 16-alpine - 強力なオープンソースリレーショナルデータベース
- **Prisma** 5.22.0 - データベースツールキット及び ORM

### 開発ツール

- **ESLint** - JavaScript/TypeScript リンター（共有設定付き）
- **Prettier** - コードフォーマッター（共有設定付き）
- **Docker Compose** - マルチコンテナ Docker オーケストレーション

## プロジェクト構造

```
.
├── apps/
│   ├── web/                    # Next.js フロントエンドアプリケーション
│   │   ├── src/
│   │   │   ├── components/     # React コンポーネント
│   │   │   │   ├── ui/        # 再利用可能な UI コンポーネント
│   │   │   │   └── domains/   # ドメイン固有のコンポーネント
│   │   │   ├── hooks/         # カスタム React フック
│   │   │   ├── pages/         # Next.js ページ
│   │   │   ├── contexts/      # React コンテキスト
│   │   │   ├── lib/           # Apollo Client セットアップ
│   │   │   ├── mocks/         # MSW モックハンドラー
│   │   │   └── styles/        # グローバルスタイル
│   │   └── .storybook/        # Storybook 設定
│   └── web-api/               # NestJS GraphQL API
│       └── src/
│           ├── modules/       # 機能モジュール
│           │   ├── app/      # メインアプリケーションモジュール
│           │   ├── hello/    # サンプル GraphQL モジュール
│           │   └── prisma/   # Prisma サービスモジュール
│           ├── config/        # 環境変数バリデーション
│           └── generated/     # 生成された GraphQL スキーマ
├── packages/
│   ├── database/              # 共有 Prisma クライアント
│   │   └── prisma/           # Prisma スキーマ
│   ├── eslint-config/         # 共有 ESLint 設定
│   │   └── src/
│   │       ├── base.js       # ベース TypeScript 設定
│   │       └── react.js      # React 固有の設定
│   └── prettier-config/       # 共有 Prettier 設定
├── docker-compose.yml         # PostgreSQL セットアップ
├── turbo.json                 # Turborepo 設定
└── pnpm-workspace.yaml        # pnpm ワークスペース設定
```

## アプリケーション

### apps/web

Next.js フロントエンドアプリケーションの特徴：

- Apollo Client による GraphQL クエリと型安全な生成フック
- コンポーネント開発とドキュメント用の Storybook
- Vitest と React Testing Library による包括的なテストセットアップ
- 開発・テスト用の MSW による API モッキング
- Tailwind CSS によるスタイリング
- Cookie 永続化によるテーマ切り替え（ライト/ダークモード）

### apps/web-api

NestJS GraphQL API の特徴：

- GraphQL エンドポイント用の Apollo Server
- データベースアクセス用の Prisma ORM
- 自動生成される GraphQL スキーマ
- 環境変数バリデーション
- NestJS モジュールによるモジュラーアーキテクチャ

## パッケージ

### packages/database

- 共有 Prisma クライアント設定
- データベーススキーマ定義
- マイグレーション管理
- 全アプリケーションに型安全なデータベースアクセスを提供

### packages/eslint-config

- TypeScript プロジェクト用の共有 ESLint 設定
- フロントエンドアプリケーション用の React 固有ルール
- monorepo 全体のコード品質と一貫性を保証

### packages/prettier-config

- 共有 Prettier 設定
- 全パッケージで一貫したコードフォーマットを保証

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

```bash
# 全アプリケーションの環境変数ファイルをコピー
cp packages/database/.env.example packages/database/.env
cp apps/web/.env.local.example apps/web/.env.local
cp apps/web-api/.env.example apps/web-api/.env
```

**データベース設定** (`packages/database/.env`):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
```

**フロントエンド設定** (`apps/web/.env.local`):

- `NEXT_PUBLIC_GRAPHQL_URL` - GraphQL API エンドポイント（デフォルト: http://localhost:3001/graphql）

**バックエンド設定** (`apps/web-api/.env`):

- `NODE_ENV` - 環境モード（デフォルト: development）
- `PORT` - API サーバーポート（デフォルト: 3001）
- `CORS_ORIGIN` - 許可する CORS オリジン（デフォルト: http://localhost:3000）
- `DATABASE_URL` - PostgreSQL 接続文字列（packages/database と同じ）

### 3. PostgreSQL の起動

```bash
docker-compose up -d
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

このコマンドは以下を実行します：

1. データベースマイグレーションを実行
2. すべての開発サーバーを並列で起動（フロントエンド + バックエンド）

## アクセス情報

- **フロントエンド**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3001/graphql
- **Storybook**: http://localhost:6006 （`pnpm --filter @repo/web storybook` を実行）
- **Prisma Studio**: `pnpm --filter @repo/database db:studio` を実行
