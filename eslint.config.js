import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
      react,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // CONVENTIONS.md: named-exports-only
      'import/no-default-export': 'error',

      // CONVENTIONS.md: no-nested-components
      'react/no-unstable-nested-components': 'error',

      // CONVENTIONS.md: import-locality — no relative imports that escape the slice
      // ../../ from a segment means you're leaving the slice boundary
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['../../*'],
            message: 'Use absolute import (@/layer/slice) for cross-slice imports. Relative paths are for intra-slice only.',
          },
        ],
      }],
    },
  },
  {
    // Exceptions: config files that require default exports
    files: ['vite.config.ts', 'steiger.config.ts', 'eslint.config.js'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
])
