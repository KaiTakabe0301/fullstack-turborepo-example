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

/**
 * 生成するラッパー文字列と必要なフック名を返す
 */
function buildWrapper(node, sourceCode) {
  const original = sourceCode.getText(node);

  if (node.type === 'ObjectExpression' || node.type === 'ArrayExpression') {
    return { text: `useMemo(() => ${original}, [])`, hookName: 'useMemo' };
  }
  return { text: `useCallback(${original}, [])`, hookName: 'useCallback' };
}

/**
 * ファイル内の `import … from 'react'` を解析し、
 * 指定 hook が未インポートなら Fixer 配列を返す
 */
function ensureReactImport(fixer, sourceCode, hookName) {
  const program = sourceCode.ast; // ESTree Program
  const reactImport = program.body.find(
    n => n.type === 'ImportDeclaration' && n.source.value === 'react'
  );

  // import が無い場合は先頭に追加
  if (!reactImport) {
    // 'use client'; などの directive を飛ばす
    const firstNode = program.body[0];
    const insertPos =
      firstNode &&
      firstNode.type === 'ExpressionStatement' &&
      firstNode.directive
        ? firstNode.range[1] + 1
        : 0;
    return [
      fixer.insertTextAfterRange(
        [0, insertPos],
        `import { ${hookName} } from 'react';\n`
      ),
    ];
  }

  // 既に同 hook が import 済みか？
  const hasNamed = reactImport.specifiers.some(
    s => s.type === 'ImportSpecifier' && s.imported.name === hookName
  );
  if (hasNamed) return []; // 追加不要

  // ----------------------------------------------------------
  // ① すでに { foo } がある → '... foo }' の直前に `, hookName`
  // ----------------------------------------------------------
  const namedSpecs = reactImport.specifiers.filter(
    s => s.type === 'ImportSpecifier'
  );

  if (namedSpecs.length > 0) {
    // } のトークンを探す
    const closeBrace = sourceCode.getTokenAfter(
      namedSpecs[namedSpecs.length - 1],
      token => token.value === '}'
    );
    return [fixer.insertTextBefore(closeBrace, `, ${hookName}`)];
  }

  // ----------------------------------------------------------
  // ② default / namespace しか無い → 新しい named import を追加
  //     import React from 'react';  →  import React, { hookName } from 'react';
  //     import * as React from 'react';  →  import * as React, { hookName } from 'react';
  // ----------------------------------------------------------
  const fromToken = sourceCode.getTokenAfter(
    reactImport.specifiers[reactImport.specifiers.length - 1],
    token => token.value === 'from'
  );

  // fromの前に { hookName } を挿入
  return [fixer.insertTextBefore(fromToken, `, { ${hookName} } `)];
}

// ---------------------------------------------------------------------------
// rule
// ---------------------------------------------------------------------------
export const requireMemoInHooksRule = createRule({
  name: 'require-memo-in-hooks',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce wrapping new objects / arrays / functions with useMemo or useCallback inside custom hooks.',
      recommended: 'error',
    },

    fixable: 'code',
    hasSuggestions: true,
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
      'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression'(node) {
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
            if (!init || isMemoed(init) || !isNewValue(init)) return;

            context.report({
              node: init,
              messageId: 'useMemo',
              fix: fixer => {
                const src = context.getSourceCode();
                const { text, hookName } = buildWrapper(init, src);
                return [
                  // 1) 変数初期化子を置換
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  fixer.replaceText(init, text),
                  // 2) 必要に応じて import 追加 / 編集
                  ...ensureReactImport(fixer, src, hookName),
                ];
              },
              suggest: [
                {
                  messageId: 'useMemo',
                  fix: fixer => {
                    const src = context.getSourceCode();
                    const { text, hookName } = buildWrapper(init, src);
                    return [
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      fixer.replaceText(init, text),
                      ...ensureReactImport(fixer, src, hookName),
                    ];
                  },
                },
              ],
            });
          });
        });
      },
    };
  },
});
