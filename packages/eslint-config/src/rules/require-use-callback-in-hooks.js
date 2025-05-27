import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  () =>
    'https://github.com/your-org/eslint-rules/blob/main/require-use-callback-in-hooks.md'
);

// ---------------------------------------------------------------------------
// utilities
// ---------------------------------------------------------------------------
function isHookName(name = '') {
  // 先頭が use + 英数字 の命名を "カスタムフック" とみなす
  return /^use[A-Z0-9].*/.test(name);
}

function isNewFunction(node) {
  // "新しく生成された" 関数
  return (
    node &&
    (node.type === 'ArrowFunctionExpression' ||
      node.type === 'FunctionExpression')
  );
}

function isUseCallbackWrapped(node) {
  // useCallback(…) 呼び出しか
  return (
    node?.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'useCallback'
  );
}

/**
 * useCallbackラッパー文字列を生成
 */
function buildUseCallbackWrapper(node, sourceCode) {
  const original = sourceCode.getText(node);
  return { text: `useCallback(${original}, [])`, hookName: 'useCallback' };
}

/**
 * ファイル内の `import … from 'react'` を解析し、
 * useCallback が未インポートなら Fixer 配列を返す
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

    // 既存のnamed importに追加
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
export const requireUseCallbackInHooksRule = createRule({
  name: 'require-use-callback-in-hooks',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce wrapping new functions with useCallback inside custom hooks.',
      recommended: 'error',
    },

    fixable: 'code',
    hasSuggestions: true,
    messages: {
      useCallback:
        'Wrap this function with useCallback inside custom hooks.',
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
            if (!init || isUseCallbackWrapped(init) || !isNewFunction(init)) return;

            context.report({
              node: init,
              messageId: 'useCallback',
              fix: fixer => {
                const src = context.getSourceCode();
                const { text, hookName } = buildUseCallbackWrapper(init, src);
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
                  messageId: 'useCallback',
                  fix: fixer => {
                    const src = context.getSourceCode();
                    const { text, hookName } = buildUseCallbackWrapper(init, src);
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
