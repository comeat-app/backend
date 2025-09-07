import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    plugins: { js, prettier: prettierPlugin },
    languageOptions: { globals: globals.node },
    extends: ['js/recommended', prettierConfig],
    rules: {
      'prettier/prettier': 'error',
    },
  },
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
]);
