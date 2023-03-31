import path from 'path';
import { defineConfig, normalizePath } from 'vite';

import dtsBundleGenerator from './src';
import p from './package.json' assert { type: 'json' };

const formats: Record<string, string> = {
  'es': path.basename(p.module),
  'cjs': path.basename(p.main)
};

export default defineConfig({
  plugins: [
    dtsBundleGenerator({
      outFile: path.basename(p.types),
      output: {
        noBanner: true
      }
    })
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: normalizePath(path.resolve('src', 'index.ts')),
      formats: ['cjs', 'es'],
      fileName: (format) => formats[format]
    },
    rollupOptions: {
      external: ['dts-bundle-generator', 'fs', 'path', 'picocolors', 'vite']
    }
  }
});
