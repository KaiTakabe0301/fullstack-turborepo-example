# Web API (GraphQL Backend)

NestJS + GraphQL (Apollo Server) + Prisma + PostgreSQL を使用したバックエンドAPI

## セットアップ

### 1. 環境変数の設定

```bash
# プロジェクトルートで
cp .env.example .env
```

### 2. PostgreSQLの起動

```bash
# プロジェクトルートで
pnpm docker:up
```

### 3. 依存関係のインストール

```bash
# プロジェクトルートで
pnpm install
```

### 4. データベースのセットアップ

```bash
# Prismaクライアントの生成
pnpm db:generate

# データベーススキーマの適用
pnpm db:push

# または、マイグレーションを使用する場合
pnpm db:migrate
```

### 5. 開発サーバーの起動

```bash
# プロジェクトルートで
pnpm dev

# または、web-apiのみを起動する場合
cd apps/web-api
pnpm dev
```

## アクセス情報

- GraphQL Playground: http://localhost:3001/graphql
- API エンドポイント: http://localhost:3001/graphql

## 利用可能なスクリプト

- `pnpm dev` - 開発サーバーの起動
- `pnpm build` - プロダクションビルド
- `pnpm start:prod` - プロダクションサーバーの起動
- `pnpm test` - テストの実行
- `pnpm lint` - ESLintの実行

## GraphQL スキーマ

スキーマファイルは `src/schema.gql` に自動生成されます。

### サンプルクエリ

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
```

## 型の自動生成

フロントエンドで使用するGraphQL型は、`packages/graphql-types`で管理されています。

```bash
# GraphQLスキーマから型を生成
pnpm codegen
```