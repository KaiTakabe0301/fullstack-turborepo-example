import { RuleTester } from 'eslint';

import { requireMemoInHooksRule } from '../require-memo-in-hooks.js';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('require-memo-in-hooks', requireMemoInHooksRule, {
  valid: [
    // カスタムフック内でuseMemoを使用している場合は問題なし
    {
      code: `
        import { useMemo } from 'react';
        function useCustomHook() {
          const value = useMemo(() => ({ foo: 'bar' }), []);
          return value;
        }
      `,
    },
    // カスタムフック内でuseCallbackを使用している場合は問題なし
    {
      code: `
        import { useCallback } from 'react';
        function useCustomHook() {
          const handler = useCallback(() => {
            console.log('clicked');
          }, []);
          return handler;
        }
      `,
    },
    // カスタムフックでない関数は対象外
    {
      code: `
        function normalFunction() {
          const obj = { foo: 'bar' };
          return obj;
        }
      `,
    },
  ],
  invalid: [
    // ケース1: React importがない場合 - 新しいimport文を追加
    {
      code: `
        function useCustomHook() {
          const obj = { foo: 'bar' };
          return obj;
        }
      `,
      errors: [{ messageId: 'useMemo' }],
      output: `
        import { useMemo } from 'react';
        function useCustomHook() {
          const obj = useMemo(() => { foo: 'bar' }, []);
          return obj;
        }
      `,
    },
    // ケース2: デフォルトimportのみの場合 - named importを追加
    {
      code: `
        import React from 'react';
        function useCustomHook() {
          const obj = { foo: 'bar' };
          return obj;
        }
      `,
      errors: [{ messageId: 'useMemo' }],
      output: `
        import React, { useMemo } from 'react';
        function useCustomHook() {
          const obj = useMemo(() => { foo: 'bar' }, []);
          return obj;
        }
      `,
    },
    // ケース3: 名前空間importのみの場合 - named importを追加
    {
      code: `
        import * as React from 'react';
        function useCustomHook() {
          const obj = { foo: 'bar' };
          return obj;
        }
      `,
      errors: [{ messageId: 'useMemo' }],
      output: `
        import * as React, { useMemo } from 'react';
        function useCustomHook() {
          const obj = useMemo(() => { foo: 'bar' }, []);
          return obj;
        }
      `,
    },
    // ケース4: 既存のnamed importがある場合 - 既存のnamed importに追加
    {
      code: `
        import { useState } from 'react';
        function useCustomHook() {
          const [state, setState] = useState(null);
          const obj = { foo: 'bar' };
          return obj;
        }
      `,
      errors: [{ messageId: 'useMemo' }],
      output: `
        import { useState, useMemo } from 'react';
        function useCustomHook() {
          const [state, setState] = useState(null);
          const obj = useMemo(() => { foo: 'bar' }, []);
          return obj;
        }
      `,
    },
    // ケース5: 関数の場合はuseCallbackを使用
    {
      code: `
        import { useState } from 'react';
        function useCustomHook() {
          const [state, setState] = useState(null);
          const handler = () => {
            console.log('clicked');
          };
          return handler;
        }
      `,
      errors: [{ messageId: 'useMemo' }],
      output: `
        import { useState, useCallback } from 'react';
        function useCustomHook() {
          const [state, setState] = useState(null);
          const handler = useCallback(() => {
            console.log('clicked');
          }, []);
          return handler;
        }
      `,
    },
    // ケース6: 複数のnamed importがある場合
    {
      code: `
        import { useState, useEffect, useRef } from 'react';
        function useCustomHook() {
          const [state, setState] = useState(null);
          const ref = useRef(null);
          useEffect(() => {}, []);
          const obj = { foo: 'bar' };
          return obj;
        }
      `,
      errors: [{ messageId: 'useMemo' }],
      output: `
        import { useState, useEffect, useRef, useMemo } from 'react';
        function useCustomHook() {
          const [state, setState] = useState(null);
          const ref = useRef(null);
          useEffect(() => {}, []);
          const obj = useMemo(() => { foo: 'bar' }, []);
          return obj;
        }
      `,
    },
    // ケース7: デフォルトimportと既存のnamed importがある場合
    {
      code: `
        import React, { useState } from 'react';
        function useCustomHook() {
          const [state, setState] = useState(null);
          const obj = { foo: 'bar' };
          return obj;
        }
      `,
      errors: [{ messageId: 'useMemo' }],
      output: `
        import React, { useState, useMemo } from 'react';
        function useCustomHook() {
          const [state, setState] = useState(null);
          const obj = useMemo(() => { foo: 'bar' }, []);
          return obj;
        }
      `,
    },
  ],
});
