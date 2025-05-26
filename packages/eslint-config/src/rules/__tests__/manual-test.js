// Manual test for the require-memo-in-hooks rule
import { requireMemoInHooksRule } from '../require-memo-in-hooks.js';

// Mock the necessary ESLint context and utilities
const mockContext = {
  getSourceCode: () => ({
    getText: node => {
      if (node.type === 'ObjectExpression') return '{ foo: "bar" }';
      if (node.type === 'ArrowFunctionExpression')
        return '() => { console.log("clicked"); }';
      return '';
    },
    ast: {
      body: [
        // Simulate different import scenarios
        {
          type: 'ImportDeclaration',
          source: { value: 'react' },
          specifiers: [
            // Case 1: Default import only
            // { type: 'ImportDefaultSpecifier', local: { name: 'React' } }

            // Case 2: Named imports
            {
              type: 'ImportSpecifier',
              imported: { name: 'useState' },
              local: { name: 'useState' },
            },

            // Case 3: Default + Named imports
            // { type: 'ImportDefaultSpecifier', local: { name: 'React' } },
            // { type: 'ImportSpecifier', imported: { name: 'useState' }, local: { name: 'useState' } }

            // Case 4: Namespace import
            // { type: 'ImportNamespaceSpecifier', local: { name: 'React' } }
          ],
        },
      ],
    },
    getTokenAfter: (node, predicate) => {
      // Mock token for testing
      return { value: '}' };
    },
  }),
  report: ({ node, messageId, fix, suggest }) => {
    console.log(`Reported issue: ${messageId}`);

    // Test the fix function
    const mockFixer = {
      replaceText: (node, text) => {
        console.log(`Replace text: ${text}`);
        return { type: 'replace' };
      },
      insertTextBefore: (node, text) => {
        console.log(`Insert before: ${text}`);
        return { type: 'insertBefore' };
      },
      insertTextAfter: (node, text) => {
        console.log(`Insert after: ${text}`);
        return { type: 'insertAfter' };
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

// Test with an object expression (should use useMemo)
const testObjectNode = {
  type: 'ObjectExpression',
  properties: [],
};

// Test with an arrow function (should use useCallback)
const testFunctionNode = {
  type: 'ArrowFunctionExpression',
  body: {},
};

console.log('Testing with object expression:');
requireMemoInHooksRule
  .create(mockContext)
  ['FunctionDeclaration, FunctionExpression, ArrowFunctionExpression']({
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
  });

console.log('\nTesting with arrow function:');
requireMemoInHooksRule
  .create(mockContext)
  ['FunctionDeclaration, FunctionExpression, ArrowFunctionExpression']({
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
  });

console.log('\nTest completed!');
