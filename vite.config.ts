import path from 'node:path';

import nodeExternals from 'rollup-plugin-node-externals';
import { defineConfig, normalizePath } from 'vite';

import p from './package.json' with { type: 'json' };
import dtsBundleGenerator from './src/index.js';

const formats: Record<string, string> = {
  'es': path.basename(p.module),
};

export default defineConfig({
  plugins: [
    nodeExternals({
      include: ['picocolors'],
    }),
    dtsBundleGenerator({
      fileName: path.basename(p.types),
      output: {
        noBanner: true,
      },
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: normalizePath(p.source),
      formats: ['es'],
      fileName: (format) => formats[format],
    },
  },
});
