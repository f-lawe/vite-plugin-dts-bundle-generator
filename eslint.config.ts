import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config({
  ignores: ['.vscode/**', 'dist/**', 'node_modules/**']
}, {
  files: ['**/*.ts'],
  plugins: {
    '@typescript-eslint': typescriptEslint.plugin
  },
  languageOptions: {
    parser: typescriptEslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname
    },
  },
  extends: [
    eslint.configs.recommended,
    typescriptEslint.configs.strictTypeChecked,
    typescriptEslint.configs.stylisticTypeChecked
  ],
  rules: {
      quotes: ['warn', 'single'],
      semi: ['warn', 'always'],
    },
});
