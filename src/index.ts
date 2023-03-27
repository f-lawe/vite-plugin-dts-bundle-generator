import fs from 'fs';
import path from 'path';

import colors from 'picocolors';
import type { EntryPointConfig } from 'dts-bundle-generator';
import { generateDtsBundle } from 'dts-bundle-generator';
import { ResolvedConfig } from 'vite';

type PluginConfig = EntryPointConfig & {
  fileName: string
};

type Bundle = {
  content: string;
  outDir: string;
  fileName: string;
  info: string;
};

const displaySize = (bytes: number) => `${(bytes / 1000).toLocaleString('en', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})} kB`;

const dtsBundleGenerator = (entryPointConfig: Omit<PluginConfig, 'filePath'>) => {
  let pluginConfig: PluginConfig;
  let viteConfig: ResolvedConfig;
  const bundles: Array<Bundle> = [];

  return {
    name: 'dts-bundle-generator',
    configResolved: (resolvedConfig: ResolvedConfig) => {
      viteConfig = resolvedConfig;

      if (viteConfig.build.lib) {
        pluginConfig = Object.assign(entryPointConfig, {
          filePath: viteConfig.build.lib.entry as string
        });
      }
    },
    buildEnd: async () => {
      const content = generateDtsBundle([pluginConfig])[0];
      bundles.push({
        content,
        outDir: viteConfig.build.outDir,
        fileName: pluginConfig.fileName,
        info: colors.dim(`${viteConfig.build.outDir}/`)
          + colors.cyan(`${pluginConfig.fileName}  `)
          + colors.dim(displaySize(Buffer.byteLength(content)))
      });
    },
    closeBundle: async () => {
      viteConfig.logger.info('\n' + colors.green('✓') + ' Declaration bundle generated.');
      bundles.forEach(bundle => {
        fs.writeFileSync(path.resolve(viteConfig.build.outDir, pluginConfig.fileName), bundle.content);
        viteConfig.logger.info(bundle.info);
      });
    }
  };
};

export default dtsBundleGenerator;
