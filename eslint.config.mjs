import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      // importPlugin.flatConfigs.recommended,
      eslintPluginPrettierRecommended,
    ],
    files: ['**/*.{mjs,ts,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      parser: tsParser,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '[iI]gnored', argsIgnorePattern: '^_' }],
      curly: ['error', 'all'],
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          pathGroups: [
            {
              pattern: '@*/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: [],
          warnOnUnassignedImports: true,
        },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      'react/display-name': 'off',
      semi: ['error', 'always'],
    },
    plugins: {
      react,
      import: importPlugin,
    },
  }
);
