import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules', 'coverage', '**/*.d.ts'],
  },
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        // Browser APIs
        ...globals.browser,
        // Node APIs
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off',
      'no-undef': 'off', // TypeScript handles undefined variables better than ESLint
      '@typescript-eslint/no-explicit-any': 'warn', // Allow 'any' type with warning for now
      '@typescript-eslint/no-unused-expressions': 'off', // Disable for now
    },
  },
];
