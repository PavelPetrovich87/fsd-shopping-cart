// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

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
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*'],
              message:
                'Use absolute import (@/layer/slice) for cross-slice imports. Relative paths are for intra-slice only.',
            },
          ],
        },
      ],
    },
  },
  {
    // Exceptions: config files that require default exports
    files: [
      'vite.config.ts',
      'steiger.config.ts',
      'eslint.config.js',
      '.storybook/**/*.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    // shadcn/ui components: allow className, co-exported variants
    files: ['src/shared/ui/shadcn/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // CONVENTIONS.md 3.2: zero-trust styling — no className on custom shared/ui components
    // Does NOT apply to shadcn/ subdirectory (library components retain className by design)
    files: ['src/shared/ui/**/*.{ts,tsx}'],
    ignores: ['src/shared/ui/shadcn/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="className"]',
          message:
            'No className in custom shared/ui components. Style internally with Tailwind, expose variant/size props.',
        },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
  {
    // Storybook CSF format requires export default for meta
    files: ['**/*.stories.tsx'],
    rules: {
      'import/no-default-export': 'off',
      'storybook/no-renderer-packages': 'off',
    },
  },
])
