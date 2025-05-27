// Simple test for the separate useMemo and useCallback rules
import { requireUseCallbackInHooksRule } from '../require-use-callback-in-hooks.js';
import { requireUseMemoInHooksRule } from '../require-use-memo-in-hooks.js';

// Mock the necessary ESLint context and utilities
function createMockContext() {
  return {
    getSourceCode: () => ({
      getText: node => {
        if (node.type === 'ObjectExpression') return '{ foo: "bar" }';
        if (node.type === 'ArrayExpression') return '[1, 2, 3]';
        if (node.type === 'ArrowFunctionExpression')
          return '() => { console.log("clicked"); }';
        return '';
      },
      ast: {
        body: [
          {
            type: 'ImportDeclaration',
            source: { value: 'react' },
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: { name: 'useState' },
                local: { name: 'useState' },
              },
            ],
          },
        ],
      },
      getTokenAfter: (node, predicate) => {
        return { value: '}' };
      },
    }),
    report: ({ node, messageId, fix, suggest }) => {
      console.log(`Reported issue: ${messageId}`);

      const mockFixer = {
        replaceText: (node, text) => {
          console.log(`Replace text: ${text}`);
          return { type: 'replace' };
        },
        insertTextBefore: (node, text) => {
          console.log(`Insert before: ${text}`);
          return { type: 'insertBefore' };
        },
        insertTextAfterRange: (range, text) => {
          console.log(`Insert after range: ${text}`);
          return { type: 'insertAfterRange' };
        },
      };

      const fixes = fix(mockFixer);
      console.log('Fixes:', fixes);
    },
  };
}

// Test nodes
const testObjectNode = {
  type: 'ObjectExpression',
  properties: [],
};

const testArrayNode = {
  type: 'ArrayExpression',
  elements: [],
};

const testFunctionNode = {
  type: 'ArrowFunctionExpression',
  body: {},
};

const testHookNode = {
  id: { name: 'useCustomHook' },
  body: {
    type: 'BlockStatement',
    body: [
      {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'obj' },
            init: testObjectNode,
          },
        ],
      },
    ],
  },
};

const testHookNodeWithArray = {
  id: { name: 'useCustomHook' },
  body: {
    type: 'BlockStatement',
    body: [
      {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'arr' },
            init: testArrayNode,
          },
        ],
      },
    ],
  },
};

const testHookNodeWithFunction = {
  id: { name: 'useCustomHook' },
  body: {
    type: 'BlockStatement',
    body: [
      {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: 'handler' },
            init: testFunctionNode,
          },
        ],
      },
    ],
  },
};

console.log('=== Testing useMemo rule ===');

console.log('\nTesting with object expression:');
const useMemoContext = createMockContext();
requireUseMemoInHooksRule
  .create(useMemoContext)
  [
    'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression'
  ](testHookNode);

console.log('\nTesting with array expression:');
const useMemoContext2 = createMockContext();
requireUseMemoInHooksRule
  .create(useMemoContext2)
  [
    'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression'
  ](testHookNodeWithArray);

console.log(
  '\nTesting with function expression (should NOT trigger useMemo rule):'
);
const useMemoContext3 = createMockContext();
requireUseMemoInHooksRule
  .create(useMemoContext3)
  [
    'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression'
  ](testHookNodeWithFunction);

console.log('\n=== Testing useCallback rule ===');

console.log('\nTesting with function expression:');
const useCallbackContext = createMockContext();
requireUseCallbackInHooksRule
  .create(useCallbackContext)
  [
    'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression'
  ](testHookNodeWithFunction);

console.log(
  '\nTesting with object expression (should NOT trigger useCallback rule):'
);
const useCallbackContext2 = createMockContext();
requireUseCallbackInHooksRule
  .create(useCallbackContext2)
  [
    'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression'
  ](testHookNode);

console.log('\nTest completed!');
