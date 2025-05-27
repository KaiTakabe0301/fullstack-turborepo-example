import { requireMemoInHooksRule } from './require-memo-in-hooks.js';
import { requireUseCallbackInHooksRule } from './require-use-callback-in-hooks.js';
import { requireUseMemoInHooksRule } from './require-use-memo-in-hooks.js';

export default {
  rules: {
    'require-memo-in-hooks': requireMemoInHooksRule,
    'require-use-memo-in-hooks': requireUseMemoInHooksRule,
    'require-use-callback-in-hooks': requireUseCallbackInHooksRule,
  },
};
