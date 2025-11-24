# Dependency Injection Implementation with InversifyJS

## Overview

このプロジェクトでは、InversifyJSを使用してDependency Injection (DI) を実装しています。
これにより、拡張性、保守性、テスタビリティが大幅に向上しました。

## Architecture

### Clean Architecture + DDD Pattern

```
src/
├── domain/                      # ドメイン層
│   └── hello/
│       ├── entities/           # ドメインエンティティ
│       │   └── Hello.entity.ts
│       └── repositories/       # リポジトリインターフェース
│           └── IHelloRepository.ts
│
├── application/                # アプリケーション層
│   └── hello/
│       └── use-case/          # ユースケース
│           ├── GetHello.ts
│           └── GetHello.test.ts
│
├── infrastructure/             # インフラストラクチャ層
│   ├── di/                    # DI設定
│   │   ├── types.ts          # Symbol-based トークン
│   │   ├── container.ts      # コンテナファクトリ
│   │   └── inversify.config.ts  # バインディング設定
│   ├── persistence/
│   │   ├── prisma/           # Prisma Client
│   │   └── repositories/     # リポジトリ実装
│   │       ├── HelloRepository.ts
│   │       └── HelloRepository.test.ts
│   └── logging/              # ロギング
│       └── Logger.ts
│
└── interfaces/                # インターフェース層
    └── http/
        ├── middleware/
        │   └── inversify.middleware.ts
        └── routes/
            └── hello.routes.ts
```

## Key Features

### 1. Symbol-based Type Tokens

型安全性を確保するため、Symbol-basedトークンを使用:

```typescript
// src/infrastructure/di/types.ts
export const TYPES = {
  PrismaClient: Symbol.for('PrismaClient'),
  Logger: Symbol.for('Logger'),
  IHelloRepository: Symbol.for('IHelloRepository'),
  GetHelloUseCase: Symbol.for('GetHelloUseCase'),
} as const;
```

### 2. Lifecycle Management

- **Singleton**: PrismaClient (アプリケーション全体で共有)
- **Request-scoped**: Logger (リクエストごとに一意のrequestId)
- **Transient**: Use Cases (リクエストごとに新しいインスタンス)

### 3. Decorator-based Injection

InversifyJSのデコレータを使用した依存性注入:

```typescript
@injectable()
export class GetHelloUseCase {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.IHelloRepository) private readonly helloRepository: IHelloRepository
  ) {}
}
```

### 4. Interface-based Design

実装ではなくインターフェースに依存:

```typescript
// Domain layer - インターフェース定義
export interface IHelloRepository {
  create(message: string, requestId?: string): HelloEntity;
}

// Infrastructure layer - 実装
@injectable()
export class HelloRepository implements IHelloRepository {
  constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

  create(message: string, requestId?: string): HelloEntity {
    return HelloEntity.create(message, requestId);
  }
}
```

## Configuration

### TypeScript Configuration

`tsconfig.json`でデコレータを有効化:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Dependencies

```json
{
  "dependencies": {
    "inversify": "^6.1.4",
    "reflect-metadata": "^0.2.2"
  }
}
```

## Usage

### Container Initialization

アプリケーション起動時に自動的に初期化:

```typescript
// src/interfaces/http/server/app.ts
import 'reflect-metadata';
import { inversifyMiddleware } from '@/interfaces/http/middleware/inversify.middleware';

app.use('*', inversifyMiddleware());
```

### Resolving Dependencies in Routes

ルートハンドラーでコンテナから依存を解決:

```typescript
import { getContainerFromContext } from '@/interfaces/http/middleware/inversify.middleware';
import { TYPES } from '@/infrastructure/di/types';

helloApp.openapi(getHelloRoute, (c) => {
  const container = getContainerFromContext(c);
  const getHelloUseCase = container.get<GetHelloUseCase>(TYPES.GetHelloUseCase);

  const result = getHelloUseCase.execute();
  return c.json(result, 200);
});
```

## Testing

### Unit Testing

DIにより、モックを簡単に注入できます:

```typescript
describe('GetHelloUseCase', () => {
  let getHelloUseCase: GetHelloUseCase;
  let mockLogger: Logger;
  let mockHelloRepository: IHelloRepository;

  beforeEach(() => {
    // モック作成
    mockLogger = { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() };
    mockHelloRepository = { create: vi.fn(), findByRequestId: vi.fn(), findAll: vi.fn() };

    // 手動でDI
    getHelloUseCase = new GetHelloUseCase(mockLogger, mockHelloRepository);
  });

  it('should execute successfully', () => {
    const mockEntity = HelloEntity.create('Test');
    vi.mocked(mockHelloRepository.create).mockReturnValue(mockEntity);

    const result = getHelloUseCase.execute();
    expect(result.message).toBe('Test');
  });
});
```

## Benefits

### ✅ 拡張性 (Scalability)
- 新しいUseCase、Repository、Serviceを簡単に追加可能
- 依存関係が自動的に解決される

### ✅ 保守性 (Maintainability)
- 依存関係が明示的で理解しやすい
- インターフェースベースの設計により変更が容易

### ✅ テスタビリティ (Testability)
- モックの注入が簡単
- 単体テストが書きやすい
- テスト用のコンテナを簡単に構築可能

### ✅ 型安全性 (Type Safety)
- Symbol-basedトークンで実行時エラーを防止
- TypeScriptの型チェックを活用

### ✅ DDDコンプライアンス
- Domain-Driven Designの原則に準拠
- レイヤー分離が明確

## Migration from Manual DI

以前の手動DI実装から移行しました:

**Before (Manual DI):**
```typescript
// interfaces/di/container.ts
export function buildContainer(c: Context): Container {
  const logger = createLogger(crypto.randomUUID());
  const prisma = getPrismaClient();
  const getHelloUseCase = new GetHelloUseCase(logger);

  return { logger, prisma, getHelloUseCase };
}
```

**After (InversifyJS):**
```typescript
// infrastructure/di/inversify.config.ts
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(getPrismaClient());
container.bind<Logger>(TYPES.Logger).toDynamicValue(() => createLogger());
container.bind<IHelloRepository>(TYPES.IHelloRepository).to(HelloRepository);
container.bind<GetHelloUseCase>(TYPES.GetHelloUseCase).to(GetHelloUseCase);
```

## Adding New Dependencies

### 1. トークンを定義

```typescript
// src/infrastructure/di/types.ts
export const TYPES = {
  // ...
  IUserRepository: Symbol.for('IUserRepository'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
} as const;
```

### 2. インターフェースを定義

```typescript
// src/domain/user/repositories/IUserRepository.ts
export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
}
```

### 3. 実装を作成

```typescript
// src/infrastructure/persistence/repositories/UserRepository.ts
@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
}
```

### 4. コンテナに登録

```typescript
// src/infrastructure/di/inversify.config.ts
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
```

### 5. UseCaseで使用

```typescript
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
  ) {}
}
```

## Troubleshooting

### Q: "Cannot read properties of undefined"エラー

A: `reflect-metadata`のインポートを確認してください:

```typescript
import 'reflect-metadata';
```

### Q: デコレータが認識されない

A: `tsconfig.json`の設定を確認:

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

### Q: テストでコンテナが見つからない

A: テストでは手動DIを使用してください:

```typescript
const useCase = new GetHelloUseCase(mockLogger, mockRepository);
```

## References

- [InversifyJS Documentation](https://inversify.io/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
