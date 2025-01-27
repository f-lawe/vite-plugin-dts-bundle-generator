import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

import type { CompilationOptions, EntryPointConfig } from 'dts-bundle-generator';
import { generateDtsBundle } from 'dts-bundle-generator';
import colors from 'picocolors';
import type { InputOption } from 'rollup';

type ExtendedEntryPointConfig = EntryPointConfig & {
  outFile: string
};

export type PluginConfig = Omit<EntryPointConfig, 'filePath'> & {
  fileName: string | ((entryName: string) => string)
};

interface DeclarationBundle {
  content: string
  outFile: string
  info: string
}

interface ResolvedConfig {
  build: {
    lib?: {
      entry: InputOption
    }
    outDir: string
  }
  logger: {
    info(msg: string): void
  }
}

const displaySize = (content: string) => {
  const size = Buffer.byteLength(content);
  const compressedSize = zlib.gzipSync(content).length;

  const options = {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  };

  return [
    `${(size / 1000).toLocaleString('en', options)} kB`,
    `gzip: ${(compressedSize / 1000).toLocaleString('en', options)} kB`,
  ].join('|');
};

const dtsBundleGenerator = (pluginConfig: PluginConfig, compilationOptions?: CompilationOptions) => {
  const viteConfig = {} as ResolvedConfig;
  const namedEntryPointConfigs: ExtendedEntryPointConfig[] = [];
  const bundles: DeclarationBundle[] = [];

  return {
    name: 'dts-bundle-generator',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configResolved: (resolvedConfig: any) => {
      Object.assign(viteConfig, resolvedConfig);

      if (viteConfig.build.lib) {
        const libEntries = typeof viteConfig.build.lib.entry == 'object'
          ? viteConfig.build.lib.entry
          : { default: viteConfig.build.lib.entry };
        const fileName = typeof pluginConfig.fileName == 'function'
          ? pluginConfig.fileName
          : () => pluginConfig.fileName as string;

        Object.entries(libEntries).forEach(([entryName, filePath]) => namedEntryPointConfigs.push({
          ...pluginConfig,
          filePath,
          outFile: fileName(entryName),
        }));
      }
    },
    buildEnd: () => {
      generateDtsBundle(namedEntryPointConfigs, compilationOptions).forEach((content, i) => bundles.push({
        content,
        outFile: path.resolve(viteConfig.build.outDir, namedEntryPointConfigs[i].outFile),
        info: colors.dim(`${viteConfig.build.outDir}/`)
          + colors.cyan(namedEntryPointConfigs[i].outFile)
          + '  '
          + colors.dim(displaySize(content)),
      }));
    },
    closeBundle: () => {
      viteConfig.logger.info(`\n${colors.green('✓')} ${bundles.length.toString()} declaration bundles generated.`);
      bundles.forEach((bundle) => {
        fs.writeFileSync(bundle.outFile, bundle.content);
        viteConfig.logger.info(bundle.info);
      });
    },
  };
};

export default dtsBundleGenerator;
