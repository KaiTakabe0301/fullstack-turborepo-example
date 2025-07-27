# Fullstack Turborepo Example

TypeScript + Monorepo + NestJS + GraphQL + Prisma + PostgreSQL のフルスタックボイラープレート

## 構成

### アプリケーション

- **apps/web** - Next.js フロントエンド
- **apps/web-api** - NestJS GraphQL バックエンド

### パッケージ

- **packages/database** - 共有Prismaクライアント
- **packages/eslint-config** - 共有ESLint設定
- **packages/prettier-config** - 共有Prettier設定

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

### 3. PostgreSQLの起動

```bash
pnpm docker:up
```

### 4. データベースのセットアップ

```bash
# Prismaクライアントの生成
pnpm db:generate

# データベーススキーマの適用
pnpm db:push
```

### 5. 開発サーバーの起動

```bash
pnpm dev
```

## アクセス情報

- **フロントエンド**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3001/graphql
- **Prisma Studio**: `pnpm db:studio`

## 利用可能なコマンド

```bash
# 開発
pnpm dev                # 全サービスの開発サーバーを起動
pnpm build              # プロダクションビルド
pnpm lint               # ESLintの実行
pnpm test               # テストの実行

# データベース
pnpm db:generate        # Prismaクライアントの生成
pnpm db:push           # スキーマの適用（開発環境）
pnpm db:migrate        # マイグレーションの実行
pnpm db:studio         # Prisma Studioの起動

# Docker
pnpm docker:up         # PostgreSQLコンテナの起動
pnpm docker:down       # PostgreSQLコンテナの停止
pnpm docker:logs       # コンテナログの表示
```

## サンプルGraphQLクエリ

```graphql
# 全ユーザーの取得
query GetUsers {
  users {
    id
    email
    name
    role
    createdAt
    updatedAt
  }
}

# ユーザーの作成
mutation CreateUser {
  createUser(createUserInput: {
    email: "user@example.com"
    name: "Test User"
    password: "password123"
    role: USER
  }) {
    id
    email
    name
    role
  }
}

# ユーザーの更新
mutation UpdateUser {
  updateUser(
    id: "user-id-here"
    updateUserInput: {
      name: "Updated Name"
    }
  ) {
    id
    name
  }
}

# ユーザーの削除
mutation RemoveUser {
  removeUser(id: "user-id-here") {
    id
  }
}
```

## プロジェクト構造

```
.
├── apps/
│   ├── web/                    # Next.js フロントエンド
│   └── web-api/                # NestJS GraphQL API
├── packages/
│   ├── database/               # Prismaクライアント
│   ├── eslint-config/          # ESLint共有設定
│   └── prettier-config/        # Prettier共有設定
├── docker-compose.yml          # PostgreSQL設定
├── turbo.json                  # Turborepo設定
└── pnpm-workspace.yaml         # pnpmワークスペース設定
```

## 技術スタック

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js, React, TypeScript
- **Backend**: NestJS, GraphQL (Apollo Server), TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **開発ツール**: ESLint, Prettier, Vitest, Storybook
- **インフラ**: Docker Compose

## 拡張性

このボイラープレートは、新しいアプリケーションやサービスを追加しやすい構造になっています：

```bash
# 新しいWebアプリの追加例
apps/admin/           # 管理画面フロントエンド
apps/admin-api/       # 管理画面用API

# 新しいサービスの追加例
apps/mobile-api/      # モバイルアプリ用API
```