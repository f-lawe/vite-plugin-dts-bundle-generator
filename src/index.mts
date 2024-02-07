import fs from 'fs';
import path from 'path';

import colors from 'picocolors';
import type { CompilationOptions, EntryPointConfig as EntryPointConfigBase } from 'dts-bundle-generator';
import { generateDtsBundle } from 'dts-bundle-generator';
import type { ResolvedConfig } from 'vite';

type EntryPointConfigExtended = EntryPointConfigBase & {
  outFile: string
};

type EntryPointConfig = Omit<EntryPointConfigExtended, 'filePath'>

type Bundle = {
  content: string;
  outFile: string;
  info: string;
};

const displaySize = (bytes: number) => `${(bytes / 1000).toLocaleString('en', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})} kB`;

const dtsBundleGenerator = (entry: EntryPointConfig | Array<EntryPointConfig>, compilationOptions?: CompilationOptions) => {
  const viteConfig: ResolvedConfig = {} as ResolvedConfig;
  const bundleEntries: Array<EntryPointConfigExtended> = [];
  const bundles: Array<Bundle> = [];

  return {
    name: 'dts-bundle-generator',
    configResolved: (resolvedConfig: ResolvedConfig) => {
      Object.assign(viteConfig, resolvedConfig);

      if (viteConfig.build.lib) {
        const libEntries = Array.isArray(viteConfig.build.lib.entry) ? viteConfig.build.lib.entry : [viteConfig.build.lib.entry] ;
        const pluginEntries = Array.isArray(entry) ? entry : [entry];

        if (libEntries.length != pluginEntries.length) {
          throw new Error('Entries count does not match');
        }

        libEntries.forEach((entry, i) => bundleEntries.push({
          filePath: entry as string,
          ...pluginEntries[i]
        }));
      }
    },
    buildEnd: async () => {
      generateDtsBundle(bundleEntries, compilationOptions).forEach((content, i) =>
        bundles.push({
          content,
          outFile: path.resolve(viteConfig.build.outDir, bundleEntries[i].outFile),
          info: colors.dim(`${viteConfig.build.outDir}/`)
            + colors.cyan(`${bundleEntries[i].outFile}  `)
            + colors.dim(displaySize(Buffer.byteLength(content)))
        })
      );
    },
    closeBundle: async () => {
      viteConfig.logger.info(`\n ${colors.green('✓')} ${bundles.length} declaration bundles generated.`);
      bundles.forEach(bundle => {
        fs.writeFileSync(bundle.outFile, bundle.content);
        viteConfig.logger.info(bundle.info);
      });
    }
  };
};

export default dtsBundleGenerator;
