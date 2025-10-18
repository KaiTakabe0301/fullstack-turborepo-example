# Web API (REST Backend)

NestJS + REST API + TypeSpec + OpenAPI + Prisma + PostgreSQL を使用したバックエンドAPI

## セットアップ

### 1. 環境変数の設定

```bash
# プロジェクトルートで
cp apps/web-api/.env.example apps/web-api/.env
```

### 2. PostgreSQLの起動

```bash
# プロジェクトルートで
docker-compose up -d
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

### 5. OpenAPIスキーマの生成

```bash
# TypeSpecからOpenAPI仕様を生成
pnpm --filter @repo/web-api generate:openapi
```

### 6. 開発サーバーの起動

```bash
# プロジェクトルートで
pnpm dev

# または、web-apiのみを起動する場合
cd apps/web-api
pnpm dev
```

## アクセス情報

- REST API: http://localhost:3001/api
- Swagger UI: http://localhost:3001/api-docs (開発環境のみ)
- OpenAPI仕様書: `src/generated/openapi.json`

## 利用可能なスクリプト

- `pnpm dev` - 開発サーバーの起動
- `pnpm build` - プロダクションビルド
- `pnpm start:prod` - プロダクションサーバーの起動
- `pnpm test` - テストの実行
- `pnpm lint` - ESLintの実行
- `pnpm generate:openapi` - TypeSpecからOpenAPI仕様を生成

## API仕様

### TypeSpec スキーマ

APIスキーマは `typespec/main.tsp` でTypeSpecを使用して定義されています。

### OpenAPI仕様書の生成

```bash
pnpm --filter @repo/web-api generate:openapi
```

このコマンドは以下を実行します：
1. `typespec/main.tsp` からOpenAPI 3.0仕様を生成
2. 生成された仕様を `src/generated/openapi.json` にコピー

### 利用可能なエンドポイント

#### GET /api/hello

Hello メッセージを取得します。

**認証**: 必須（Auth0 JWT Bearer Token）

**レスポンス例**:
```json
{
  "message": "Hello from GraphQL API!"
}
```

**cURLサンプル**:
```bash
curl -X GET http://localhost:3001/api/hello \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 認証

このAPIはAuth0 JWTトークンを使用した認証を実装しています。

### 必要な環境変数

```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier
```

### リクエストヘッダー

```
Authorization: Bearer <your-jwt-token>
```

## 開発フロー

### 1. APIの追加

1. **TypeSpecでスキーマを定義** (`typespec/main.tsp`):
```typescript
@route("/api/users")
namespace Users {
  @get
  op listUsers(): {
    @statusCode statusCode: 200;
    @body body: User[];
  };
}
```

2. **OpenAPI仕様を生成**:
```bash
pnpm generate:openapi
```

3. **DTOを作成** (`src/modules/.../dto/`):
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}
```

4. **Controllerを実装** (`src/modules/.../controller.ts`):
```typescript
@Controller('api/users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ type: [UserDto] })
  listUsers(): UserDto[] {
    // Implementation
  }
}
```

### 2. スキーマの変更

1. `typespec/main.tsp` を編集
2. `pnpm generate:openapi` を実行
3. DTOとControllerを更新

## プロジェクト構成

```
apps/web-api/
├── typespec/              # TypeSpec スキーマ定義
│   ├── main.tsp          # メインスキーマファイル
│   └── tspconfig.yaml    # TypeSpec設定
├── src/
│   ├── modules/          # 機能モジュール
│   │   ├── app/         # アプリケーションモジュール
│   │   ├── auth/        # 認証モジュール
│   │   ├── hello/       # Hello APIモジュール
│   │   │   ├── dto/    # Data Transfer Objects
│   │   │   ├── hello.controller.ts
│   │   │   ├── hello.service.ts
│   │   │   └── hello.module.ts
│   │   └── prisma/      # Prismaモジュール
│   ├── config/          # 設定ファイル
│   ├── generated/       # 生成ファイル
│   │   └── openapi.json # OpenAPI仕様書
│   └── main.ts          # エントリーポイント
├── tsp-output/          # TypeSpec出力（gitignore）
└── dist/                # ビルド出力
```

## Swagger UI

開発環境では、Swagger UIが http://localhost:3001/api-docs で利用可能です。

Swagger UIでは以下が可能です：
- API仕様の確認
- エンドポイントのテスト
- レスポンスの確認
- 認証トークンの設定

## テスト

```bash
# 単体テスト
pnpm test

# 監視モード
pnpm test:watch

# カバレッジ
pnpm test:cov

# E2Eテスト
pnpm test:e2e
```
