import path from 'path';
import type { ExternalOption } from 'rollup';
import { defineConfig, normalizePath } from 'vite';

import p from './package.json' assert { type: 'json' };

const dependencies = Object.keys(p.dependencies).concat(Object.keys(p.peerDependencies));

const external: ExternalOption = (source) => ['fs'].concat(dependencies).some(d => source.indexOf(d) == 0);

const formats: Record<string, string> = {
  'es': normalizePath(path.basename(p.module)),
  'cjs': normalizePath(path.basename(p.main))
};

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: normalizePath(path.resolve(__dirname, 'src', 'index.ts')),
      formats: ['cjs', 'es'],
      fileName: (format) => formats[format]
    },
    rollupOptions: {
      external
    }
  }
});
