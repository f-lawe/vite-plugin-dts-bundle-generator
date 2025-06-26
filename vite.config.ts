import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig, normalizePath } from 'vite';

import p from './package.json' with { type: 'json' };
import dtsBundleGenerator from './src/vite';

const entry = Object.fromEntries(Object.keys(p.exports).map((exportKey) => exportKey === '.'
  ? ['dts-bundle-generator', normalizePath('./src/index.ts')]
  : [exportKey.replace('./', ''), normalizePath(`./src/${exportKey.replace('./', '')}.ts`)],
));

export default defineConfig({
  plugins: [
    nodeExternals({
      include: ['picocolors'],
    }),
    dtsBundleGenerator({
      fileName: (entryName: string) => `${entryName}.d.ts`,
      output: {
        noBanner: true,
      },
      compilation: {
        preferredConfigPath: './tsconfig.json',
      },
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry,
      formats: ['cjs', 'es'],
      fileName: (format: string, entryName: string) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
  },
});
