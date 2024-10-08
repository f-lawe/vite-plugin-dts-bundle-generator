import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error Missing types
import js from '@eslint/js';
// @ts-expect-error Missing types
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  files: ['**/*.ts', '**/*.mts'],
  ignores: ['.vscode', 'dist', 'node_modules'],
}, ...compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
), {
  plugins: {
    '@typescript-eslint': typescriptEslint,
  },
  languageOptions: {
    parser: tsParser,
  },
  rules: {
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
  },
}];
