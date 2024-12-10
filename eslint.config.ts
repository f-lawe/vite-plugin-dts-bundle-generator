import eslint from '@eslint/js';
import typescript from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
  ...typescript.config({
    ignores: ['.vscode/**', 'dist/**', 'node_modules/**'],
  }, {
    files: ['**/*.ts'],
    plugins: {
      '@typescript': typescript.plugin,
      // eslint-disalble-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error Stylistic plugin is not compatible with TypeScript ESLint types
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      eslint.configs.recommended,
      typescript.configs.strictTypeChecked,
      typescript.configs.stylisticTypeChecked,
      stylistic.configs['recommended-flat'],
    ],
    rules: {
      '@stylistic/arrow-parens': ['warn', 'always'],
      '@stylistic/max-len': ['warn', 120],
      '@stylistic/quote-props': ['warn', 'consistent'],
      '@stylistic/semi': ['warn', 'always'],
    },
  }),
];
