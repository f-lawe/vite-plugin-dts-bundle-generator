import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import typescript from 'typescript-eslint';

export default typescript.config({
  ignores: ['.vscode/**', 'dist/**', 'node_modules/**'],
}, {
  files: ['**/*.ts'],
  plugins: {
    '@typescript-eslint': typescript.plugin,
    '@simple-import-sort': simpleImportSort,
    '@stylistic': stylistic,
  },
  languageOptions: {
    parser: typescript.parser,
    parserOptions: {
      projectService: true,
    },
  },
  extends: [
    eslint.configs.recommended,
    typescript.configs.strictTypeChecked,
    typescript.configs.stylisticTypeChecked,
    stylistic.configs.recommended,
  ],
  rules: {
    '@simple-import-sort/imports': 'warn',
    '@stylistic/arrow-parens': ['warn', 'always'],
    '@stylistic/max-len': ['warn', 120],
    '@stylistic/quote-props': ['warn', 'consistent'],
    '@stylistic/semi': ['warn', 'always'],
    '@typescript-eslint/array-type': ['warn', { default: 'generic' }],
  },
});
