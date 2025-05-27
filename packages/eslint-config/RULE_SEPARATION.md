# ESLint Rule Separation: useMemo and useCallback

## Overview

The original `require-memo-in-hooks` rule has been split into two separate rules for better granular control:

1. `require-use-memo-in-hooks` - Enforces useMemo for objects and arrays
2. `require-use-callback-in-hooks` - Enforces useCallback for functions

## Rules

### require-use-memo-in-hooks

**Purpose**: Enforces wrapping new objects and arrays with `useMemo` inside custom hooks.

**Triggers on**:
- Object expressions: `{ foo: 'bar' }`
- Array expressions: `[1, 2, 3]`

**Auto-fix**: Wraps the value with `useMemo(() => value, [])`

**Example**:
```javascript
// Before
function useCustomHook() {
  const obj = { foo: 'bar' };
  const arr = [1, 2, 3];
  return { obj, arr };
}

// After (auto-fixed)
import { useMemo } from 'react';

function useCustomHook() {
  const obj = useMemo(() => ({ foo: 'bar' }), []);
  const arr = useMemo(() => [1, 2, 3], []);
  return { obj, arr };
}
```

### require-use-callback-in-hooks

**Purpose**: Enforces wrapping new functions with `useCallback` inside custom hooks.

**Triggers on**:
- Arrow function expressions: `() => {}`
- Function expressions: `function() {}`

**Auto-fix**: Wraps the function with `useCallback(function, [])`

**Example**:
```javascript
// Before
function useCustomHook() {
  const handler = () => {
    console.log('clicked');
  };
  return handler;
}

// After (auto-fixed)
import { useCallback } from 'react';

function useCustomHook() {
  const handler = useCallback(() => {
    console.log('clicked');
  }, []);
  return handler;
}
```

## Configuration

Both rules are enabled in the React configuration:

```javascript
// packages/eslint-config/src/react.js
rules: {
  'custom-hooks/require-use-memo-in-hooks': 'error',
  'custom-hooks/require-use-callback-in-hooks': 'error',
}
```

## Benefits of Separation

1. **Granular Control**: You can enable/disable useMemo and useCallback enforcement separately
2. **Clearer Error Messages**: Each rule has specific error messages for its use case
3. **Better Maintainability**: Separate concerns make the code easier to understand and maintain
4. **Flexible Configuration**: Teams can choose to enforce only one type of memoization if needed

## Migration

The original `require-memo-in-hooks` rule is still available for backward compatibility, but it's recommended to use the new separate rules for better control.

To migrate:
1. Replace `'custom-hooks/require-memo-in-hooks': 'error'` with:
   ```javascript
   'custom-hooks/require-use-memo-in-hooks': 'error',
   'custom-hooks/require-use-callback-in-hooks': 'error',
   ```

2. If you only want to enforce one type of memoization, enable only the relevant rule.
