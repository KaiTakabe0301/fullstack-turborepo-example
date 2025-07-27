# GraphQL Code Generation

このプロジェクトでは、GraphQL Code Generator v5を使用してTypeScriptの型定義とクライアントコードを自動生成しています。最新のclientプリセットを使用し、より良い開発体験と小さいバンドルサイズを実現しています。

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

clientプリセットでは、`graphql()`関数を使用してクエリを定義します：

`src/graphql/queries.ts`:

```typescript
import { graphql } from '@/gql';

export const GET_USERS = graphql(/* GraphQL */ `
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
`);

export const CREATE_USER = graphql(/* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
      email
      name
      role
    }
  }
`);
```

### 2. 生成されたコードの使用

Apollo Clientと組み合わせて使用します：

```typescript
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, CREATE_USER } from '@/graphql/queries';

export function UserList() {
  const { data, loading, error } = useQuery(GET_USERS);
  const [createUser, { loading: creating }] = useMutation(CREATE_USER);

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

`codegen.ts`（TypeScript形式）の詳細：

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true, // 既存のファイルを上書き
  schema: 'http://localhost:3001/graphql', // GraphQLスキーマのURL
  documents: 'src/**/*.{ts,tsx}', // GraphQL操作を含むファイル
  generates: {
    'src/gql/': {
      // 出力ディレクトリ
      preset: 'client', // clientプリセットを使用
      config: {
        useTypeImports: true, // TypeScriptのtype importを使用
        scalars: {
          Date: 'DateString', // カスタムスカラー型のマッピング
        },
      },
    },
  },
};

export default config;
```

### 旧設定からの主な変更点

1. **設定ファイル形式**: `codegen.yml`（YAML） → `codegen.ts`（TypeScript）
2. **プリセット**: 個別プラグイン → `client`プリセット
3. **生成先**: `src/generated/graphql.ts` → `src/gql/`ディレクトリ
4. **API**: カスタムHooks → `graphql()`関数とApollo Clientの標準Hooks

## トラブルシューティング

### エラー: Unable to find any GraphQL type definitions

GraphQLクエリやミューテーションが定義されていない場合に発生します。`.ts`または`.tsx`ファイルにGraphQL操作を定義してください。

### エラー: Failed to load schema

バックエンドサーバーが起動していることを確認してください。`http://localhost:3001/graphql`にアクセスできる必要があります。

### 型が更新されない

1. `pnpm codegen`を再実行
2. 生成されたディレクトリ（`src/gql/`）を削除して再生成
3. バックエンドのスキーマが更新されていることを確認

### 生成されたファイルについて

`src/gql/`ディレクトリには以下のファイルが生成されます：

- `graphql.ts`: 型定義
- `gql.ts`: graphql関数の定義
- `fragment-masking.ts`: フラグメント用ユーティリティ
- `index.ts`: エクスポート用インデックス

これらのファイルは自動生成されるため、`.gitignore`に追加することを推奨します。
