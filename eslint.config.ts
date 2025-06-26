import antfu from '@antfu/eslint-config';

export default antfu({
  type: 'lib',
  stylistic: {
    semi: true,
  },
}, {
  rules: {
    'no-console': 'off',
    'antfu/top-level-function': 'off',
    'style/arrow-parens': ['warn', 'always'],
    'style/max-len': ['warn', 120],
    'style/quote-props': ['warn', 'consistent'],
    'ts/array-type': ['warn', { default: 'generic' }],
  },
}, {
  files: ['**/package.json'],
  rules: {
    'jsonc/sort-keys': 'off',
  },
}, {
  files: ['*.md', '**/*.md'],
  rules: {
    'style/max-len': 'off',
  },
});
