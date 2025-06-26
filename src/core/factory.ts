import type { CompilationOptions, EntryPointConfig } from 'dts-bundle-generator';
import type { InputOption } from 'rollup';
import type { UnpluginFactory } from 'unplugin';

import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

import { generateDtsBundle } from 'dts-bundle-generator';
import colors from 'picocolors';

export interface Options {
  fileName: string | ((entryName: string) => string);
  output?: EntryPointConfig['output'];
  libraries?: EntryPointConfig['libraries'];
  compilation?: CompilationOptions;
}

interface DeclarationBundle {
  compressedSize: number;
  content: string;
  outFile: string;
  size: number;
}

interface BuildConfig {
  outDir: string;
}

const assignEntry = (entry: Record<string, string>, input: InputOption): void => {
  if (typeof input == 'string') {
    Object.assign(entry, {
      default: input,
    });
  }
  else if (Array.isArray(input)) {
    input.forEach((i) => {
      Object.assign(entry, {
        [path.basename(i, path.extname(i))]: i,
      });
    });
  }
  else {
    Object.assign(entry, input);
  }
};

export const unpluginFactory: UnpluginFactory<Options, false> = (options) => {
  const bundles: Array<DeclarationBundle> = [];
  const entry: Record<string, string> = {};
  const buildConfig: BuildConfig = {} as BuildConfig;

  const fileName = typeof options.fileName == 'function'
    ? options.fileName
    : () => options.fileName as string;

  return {
    name: 'unplugin-dts-bundle-generator',
    buildEnd() {
      const entryPointConfigs: Array<EntryPointConfig> = Object.values(entry).map((entryPath) => ({
        filePath: entryPath,
        libraries: options.libraries,
        output: options.output,
      }));

      generateDtsBundle(entryPointConfigs, options.compilation).forEach((content, i) => bundles.push({
        compressedSize: zlib.gzipSync(content).length,
        content,
        outFile: fileName(Object.keys(entry)[i]),
        size: Buffer.byteLength(content),
      }));
    },
    writeBundle() {
      bundles.forEach((bundle) => fs.writeFileSync(path.resolve(buildConfig.outDir, bundle.outFile), bundle.content));
    },
    vite: {
      configResolved(config) {
        if (config.build.lib) {
          assignEntry(entry, config.build.lib.entry);
        }

        buildConfig.outDir = config.build.outDir;
      },
      closeBundle() {
        const length = bundles.length.toString();
        this.environment.logger.info(`\n${colors.green('✓')} ${length} declaration bundles generated.`);

        const options = {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        };

        bundles.forEach((bundle) => this.environment.logger.info(
          colors.dim(`${buildConfig.outDir}/`)
          + colors.cyan(`${bundle.outFile}  `)
          + colors.dim(`${(bundle.size / 1000).toLocaleString('en', options)} kB  │ `)
          + colors.dim(`gzip: ${(bundle.compressedSize / 1000).toLocaleString('en', options)} kB`),
        ));
      },
    },
  };
};
