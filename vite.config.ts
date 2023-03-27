import path from 'path';
import type { ExternalOption } from 'rollup';
import { defineConfig, normalizePath } from 'vite';

import dtsBundleGenerator from './src';
import p from './package.json' assert { type: 'json' };

const dependencies = Object.keys(p.dependencies).concat(Object.keys(p.peerDependencies));

const external: ExternalOption = (source) => ['fs', 'picocolors'].concat(dependencies).some(d => source.indexOf(d) == 0);

const formats: Record<string, string> = {
  'es': path.basename(p.module),
  'cjs': path.basename(p.main)
};

export default defineConfig({
  plugins: [
    dtsBundleGenerator({
      fileName: path.basename(p.types),
      output: { noBanner: true }
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
      external
    }
  }
});