# @repo/prettier-config

共有Prettier設定パッケージです。プロジェクト全体で一貫したコードフォーマットを提供します。

## 特徴

- 一貫したコードフォーマット
- TypeScript/JavaScript/JSX対応
- 日本語コメント対応
- モダンなJavaScript構文に最適化

## 設定内容

- **行幅**: 80文字
- **インデント**: スペース2文字
- **クォート**: シングルクォート使用
- **セミコロン**: 必須
- **末尾カンマ**: ES5準拠
- **改行文字**: LF (Unix形式)

## 使用方法

1. パッケージをインストール:
```bash
pnpm add -D @repo/prettier-config
```

2. `package.json` で設定を指定:
```json
{
  "prettier": "@repo/prettier-config"
}
```

または、`.prettierrc.js` ファイルを作成:
```javascript
module.exports = require('@repo/prettier-config');
```

## カスタマイズ

プロジェクト固有の設定が必要な場合は、`.prettierrc.js` でベース設定を拡張できます:

```javascript
const baseConfig = require('@repo/prettier-config');

module.exports = {
  ...baseConfig,
  printWidth: 100, // 行幅を100文字に変更
  tabWidth: 4,     // インデントを4スペースに変更
};
```

## VSCode設定

VSCodeで自動フォーマットを有効にするには、`.vscode/settings.json` に以下を追加:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
