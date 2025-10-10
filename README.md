# フルスタック Turborepo サンプルアプリケーション

このプロジェクトは、最新のWeb開発技術を使用したフルスタックアプリケーションのサンプルです。Turborepoを使用したモノレポ構造で、フロントエンド、バックエンド、共有パッケージを効率的に管理します。

## 🚀 技術スタック

### フロントエンド
- **Next.js 15.3** - Reactベースのフレームワーク（Turbopack対応）
- **React 19** - UIライブラリ（最新版）
- **Apollo Client** - GraphQLクライアント
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **Vitest** - 高速なユニットテストフレームワーク
- **Storybook** - UIコンポーネント開発環境
- **MSW** - APIモッキングライブラリ

### バックエンド
- **NestJS** - Node.js用のプログレッシブフレームワーク
- **Apollo Server** - GraphQLサーバー
- **Prisma** - 次世代ORM
- **PostgreSQL 16** - リレーショナルデータベース
- **Jest** - テストフレームワーク

### ビルド・開発ツール
- **Turborepo** - モノレポ管理ツール
- **pnpm** - 高速で効率的なパッケージマネージャー
- **TypeScript** - 型安全なJavaScript
- **ESLint** - コード品質ツール
- **Prettier** - コードフォーマッター

## 📁 プロジェクト構造

```
fullstack-turborepo-example/
├── apps/
│   ├── web/                 # Next.js フロントエンドアプリケーション
│   └── web-api/            # NestJS GraphQL APIサーバー
├── packages/
│   ├── database/           # Prismaデータベース設定と共有モデル
│   ├── eslint-config/      # 共有ESLint設定
│   └── prettier-config/    # 共有Prettier設定
├── turbo.json             # Turborepo設定
├── pnpm-workspace.yaml    # pnpmワークスペース設定
└── docker-compose.yml     # Docker設定（PostgreSQL）
```

## 🛠️ セットアップ

### 前提条件
- Node.js 18以上
- pnpm 9.15.1以上
- Docker（データベース用）

### インストール手順

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd fullstack-turborepo-example
```

2. **依存関係のインストール**
```bash
pnpm install
```

3. **環境変数の設定**
```bash
# ルートディレクトリに.envファイルを作成
cp .env.example .env
```

環境変数の例:
```env
# データベース接続
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"

# PostgreSQL設定（Docker）
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mydb
```

4. **データベースの起動**
```bash
docker-compose up -d
```

5. **データベースマイグレーション**
```bash
pnpm db:migrate
```

## 🚀 開発

### 開発サーバーの起動
```bash
pnpm dev
```

このコマンドは以下を実行します：
1. データベースマイグレーション
2. Prismaクライアント生成
3. GraphQLスキーマ生成
4. GraphQLコード生成
5. 開発サーバー起動（Web: http://localhost:3000, API: http://localhost:3001）

### 主要なコマンド

#### 開発
```bash
pnpm dev          # 全アプリケーションの開発サーバー起動
pnpm build        # 全アプリケーションのビルド
pnpm lint         # リントチェック
pnpm test         # テスト実行
```

#### データベース
```bash
pnpm db:generate  # Prismaクライアント生成
pnpm db:push      # スキーマをデータベースに反映
pnpm db:migrate   # マイグレーション実行
```

#### コード生成
```bash
pnpm generate:schema  # GraphQLスキーマ生成
pnpm codegen          # GraphQLクライアントコード生成
```

### アプリケーション別コマンド

#### Webアプリケーション（apps/web）
```bash
cd apps/web
pnpm dev              # Next.js開発サーバー（Turbopack）
pnpm build            # プロダクションビルド
pnpm storybook        # Storybook起動
pnpm test             # Vitestテスト実行
pnpm test:watch       # テストウォッチモード
pnpm test:coverage    # カバレッジレポート生成
```

#### APIサーバー（apps/web-api）
```bash
cd apps/web-api
pnpm dev              # NestJS開発サーバー
pnpm build            # プロダクションビルド
pnpm test             # Jestテスト実行
pnpm test:e2e         # E2Eテスト実行
pnpm generate:schema  # GraphQLスキーマ生成
```

## 🏗️ アーキテクチャ

### Turborepo タスク依存関係

このプロジェクトでは、Turborepoを使用してタスク間の依存関係を管理しています：

```
db:generate → generate:schema → codegen → build/dev
```

1. **db:generate**: Prismaクライアントを生成
2. **generate:schema**: PrismaモデルからGraphQLスキーマを生成
3. **codegen**: GraphQLスキーマからTypeScript型定義を生成
4. **build/dev**: アプリケーションのビルドまたは開発サーバー起動

### データフロー

```
PostgreSQL ↔ Prisma ↔ NestJS/GraphQL API ↔ Apollo Client ↔ Next.js/React
```

## 📡 サンプルGraphQLクエリ

GraphQL Playground: http://localhost:3001/graphql

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

## 🧪 テスト

### フロントエンドテスト
- **Vitest**: 高速なユニットテスト
- **React Testing Library**: コンポーネントテスト
- **MSW**: APIモッキング

### バックエンドテスト
- **Jest**: ユニット・統合テスト
- **Supertest**: E2Eテスト

## 📦 デプロイ

プロダクションビルドの作成：
```bash
pnpm build
```

各アプリケーションは独立してデプロイ可能です：
- **Web**: Vercel、Netlifyなどの静的ホスティングサービス
- **API**: Heroku、AWS、Google Cloud Runなどのコンテナ対応サービス

## 🔧 拡張性

このボイラープレートは、新しいアプリケーションやサービスを追加しやすい構造になっています：

```bash
# 新しいWebアプリの追加例
apps/admin/           # 管理画面フロントエンド
apps/admin-api/       # 管理画面用API

# 新しいサービスの追加例
apps/mobile-api/      # モバイルアプリ用API
apps/scheduler/       # バックグラウンドジョブスケジューラー

# 新しい共有パッケージの追加例
packages/ui/          # 共有UIコンポーネントライブラリ
packages/types/       # 共有TypeScript型定義
packages/utils/       # 共有ユーティリティ関数
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを開く

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。