import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.vite', '**/*.tsbuildinfo']),
  {
    files: ['scripts/**/*.ts', 'vite.config.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['scripts/**', 'vite.config.ts'],
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
  },
  {
    files: ['src/App.tsx'],
    rules: {
      /** URL → state sync for SEO locale + ?example= is intentional; not arbitrary cascading setState. */
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
