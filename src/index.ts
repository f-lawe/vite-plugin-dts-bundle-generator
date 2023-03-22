import { writeFileSync } from 'fs';

import type { EntryPointConfig } from 'dts-bundle-generator';
import { generateDtsBundle } from 'dts-bundle-generator';
import type { UserConfig } from 'vite';

export const dtsBundleGenerator = (output: string, entryPointConfig: Omit<EntryPointConfig, 'filePath'>) => {
  const config: Partial<EntryPointConfig> = entryPointConfig;

  return {
    name: 'dts-bundle-generator',
    config: (userConfig: UserConfig) => {
      if (userConfig.build?.lib) {
        config.filePath = userConfig.build?.lib.entry as string;
      }
    },
    closeBundle: async () => {
      const dtsBundle = generateDtsBundle([entryPointConfig as EntryPointConfig])[0];
      writeFileSync(output, dtsBundle);
    }
  };
};
