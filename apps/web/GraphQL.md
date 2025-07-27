# GraphQL Code Generation

このプロジェクトでは、GraphQL Code Generatorを使用してTypeScriptの型定義とReact Hooksを自動生成しています。

## セットアップ

### 1. バックエンドの起動

GraphQL型を生成するには、まずバックエンドサーバーが起動している必要があります：

```bash
# プロジェクトルートで
pnpm dev
```

または個別に：

```bash
cd apps/web-api
pnpm dev
```

### 2. 型の生成

```bash
cd apps/web
pnpm codegen
```

### 3. ウォッチモード

開発中は、GraphQLファイルの変更を監視して自動的に型を再生成できます：

```bash
pnpm codegen:watch
```

## 使用方法

### 1. GraphQLクエリの定義

`src/graphql/queries/users.ts`:
```typescript
import { gql } from '@apollo/client';

export const GET_USERS = gql`
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
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
      email
      name
      role
    }
  }
`;
```

### 2. 生成された型とHooksの使用

```typescript
import { useGetUsersQuery, useCreateUserMutation } from '@/generated/graphql';

export function UserList() {
  const { data, loading, error } = useGetUsersQuery();
  const [createUser, { loading: creating }] = useCreateUserMutation();

  const handleCreateUser = async () => {
    await createUser({
      variables: {
        input: {
          email: 'new@example.com',
          name: 'New User',
          password: 'password123',
          role: 'USER'
        }
      }
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.users.map(user => (
        <div key={user.id}>
          {user.name} ({user.email})
        </div>
      ))}
      <button onClick={handleCreateUser} disabled={creating}>
        Create User
      </button>
    </div>
  );
}
```

## 設定ファイル

`codegen.yml`の詳細：

```yaml
overwrite: true                    # 既存のファイルを上書き
schema: "http://localhost:3001/graphql"  # GraphQLスキーマのURL
documents: "src/**/*.{ts,tsx}"     # GraphQL操作を含むファイル
generates:
  src/generated/graphql.ts:        # 出力ファイル
    plugins:
      - "typescript"               # 基本的なTypeScript型
      - "typescript-operations"    # クエリ・ミューテーション用の型
      - "typescript-react-apollo"  # React Hooks
    config:
      withHooks: true              # Hooksを生成
      withComponent: false         # コンポーネントは生成しない
      withHOC: false              # HOCは生成しない
      scalars:
        DateTime: string           # カスタムスカラー型のマッピング
        Date: string
```

## トラブルシューティング

### エラー: Unable to find any GraphQL type definitions

GraphQLクエリやミューテーションが定義されていない場合に発生します。`.ts`または`.tsx`ファイルにGraphQL操作を定義してください。

### エラー: Failed to load schema

バックエンドサーバーが起動していることを確認してください。`http://localhost:3001/graphql`にアクセスできる必要があります。

### 型が更新されない

1. `pnpm codegen`を再実行
2. 生成されたファイル（`src/generated/graphql.ts`）を削除して再生成
3. バックエンドのスキーマが更新されていることを確認