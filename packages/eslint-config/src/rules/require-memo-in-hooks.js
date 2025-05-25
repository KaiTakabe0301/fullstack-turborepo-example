import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  () =>
    'https://github.com/your-org/eslint-rules/blob/main/require-memo-in-hooks.md'
);

// ---------------------------------------------------------------------------
// utilities
// ---------------------------------------------------------------------------
function isHookName(name = '') {
  // 先頭が use + 英数字 の命名を “カスタムフック” とみなす
  return /^use[A-Z0-9].*/.test(name);
}

function isNewValue(node) {
  // “新しく生成された” オブジェクト / 配列 / 関数
  return (
    node &&
    (node.type === 'ObjectExpression' ||
      node.type === 'ArrayExpression' ||
      node.type === 'ArrowFunctionExpression' ||
      node.type === 'FunctionExpression')
  );
}

function isMemoed(node) {
  // useMemo(…) / useCallback(…) 呼び出しか
  return (
    node?.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ['useMemo', 'useCallback'].includes(node.callee.name)
  );
}

// ---------------------------------------------------------------------------
// rule
// ---------------------------------------------------------------------------
export const requireMemoInHooksRule = createRule({
  name: 'require-memo-in-hooks',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce wrapping new objects / arrays / functions with useMemo or useCallback inside custom hooks.',
      recommended: 'error',
    },
    messages: {
      useMemo:
        'Wrap this value with useMemo or useCallback inside custom hooks.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      // すべての関数 (宣言 / 式 / アロー) を捕捉
      'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression'(
        node
      ) {
        // 関数名を取得
        const name =
          node.id?.name ??
          (node.parent?.type === 'VariableDeclarator' &&
          node.parent.id.type === 'Identifier'
            ? node.parent.id.name
            : undefined);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!isHookName(name)) return; // カスタムフック以外は無視

        // フック本体の直下文を走査
        const body = node.body;
        if (body?.type !== 'BlockStatement') return;

        body.body.forEach(statement => {
          // ① 変数宣言だけを見る
          if (statement.type !== 'VariableDeclaration') return;

          statement.declarations.forEach(decl => {
            const init = decl.init;
            if (!init) return; // 初期化子なし

            // すでに useMemo / useCallback なら OK
            if (isMemoed(init)) return;

            // “新規生成値” がそのまま束縛されていたらエラー
            if (isNewValue(init)) {
              context.report({
                node: init,
                messageId: 'useMemo',
              });
            }
          });
        });
      },
    };
  },
});
