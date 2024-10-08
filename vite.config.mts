import path from 'path';
import { defineConfig, normalizePath } from 'vite';

import dtsBundleGenerator from './src/index.mjs';
import p from './package.json' with { type: 'json' };

const formats: Record<string, string> = {
  'es': path.basename(p.module)
};

export default defineConfig({
  plugins: [
    dtsBundleGenerator({
      fileName: path.basename(p.types),
      output: {
        noBanner: true,
      }
    })
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: normalizePath(p.source),
      formats: ['es'],
      fileName: (format) => formats[format]
    },
    rollupOptions: {
      external: ['dts-bundle-generator', 'fs', 'path', 'picocolors', 'vite']
    }
  }
});
