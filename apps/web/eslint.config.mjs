import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import reactConfig from '@repo/eslint-config/react';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * 設定配列から使用されている plugin 名を抽出
 */
function extractPluginNames(configs) {
  const pluginNames = new Set();
  configs.forEach(config => {
    if (config.plugins) {
      Object.keys(config.plugins).forEach(name => pluginNames.add(name));
    }
  });
  return pluginNames;
}

/**
 * 指定された plugin 名のセットに含まれる plugin を設定から除外
 */
function excludePlugins(configs, pluginNamesToExclude) {
  return configs.map(cfg => {
    if (!cfg.plugins) return cfg;

    const remaining = Object.fromEntries(
      Object.entries(cfg.plugins).filter(
        ([name]) => !pluginNamesToExclude.has(name)
      )
    );

    const { plugins, ...rest } = cfg;
    return Object.keys(remaining).length > 0
      ? { ...rest, plugins: remaining }
      : rest;
  });
}

// 事前に読み込まれる設定を準備
const nextConfigs = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('prettier'),
  ...compat.plugins('prettier'),
  ...compat.extends('plugin:storybook/recommended'),
];

// 既に使用されている plugin 名を動的に抽出
const alreadyLoadedPlugins = extractPluginNames(nextConfigs);

const eslintConfig = [
  // 事前に準備した設定を展開
  ...nextConfigs,

  // 共通ESLint設定を適用（重複するpluginを除外して展開）
  ...excludePlugins(reactConfig, alreadyLoadedPlugins),

  // プロジェクト固有の設定
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.config.*', '**/.*.js', '**/.*.mjs'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',
    },
  },

  // Storybookファイル向けの設定
  {
    files: ['**/*.stories.@(js|jsx|ts|tsx)'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // テストファイル向けの追加設定
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
];

export default eslintConfig;
