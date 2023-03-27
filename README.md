# DTS Bundle Generator Vite plugin

![npm](https://img.shields.io/npm/v/vite-plugin-dts-bundle-generator)
![NPM](https://img.shields.io/npm/l/vite-plugin-dts-bundle-generator)

Ever wanted to easily package your library with a bundled declaration file? Integrate [DTS Bundle Generator](https://github.com/timocov/dts-bundle-generator) when using [Vite]()!

## Install
```sh
# npm
npm i vite-plugin-dts-bundle-generator

# yarn
yarn add vite-plugin-dts-bundle-generator
```

## Usage
In your `vite.config.ts`:

```ts
import path from 'path';
import { defineConfig, normalizePath } from 'vite';
import dtsBundleGenerator from 'vite-plugin-dts-bundle-generator';

export default defineConfig({
  plugin: [
    dtsBundleGenerator({ fileName: 'my-lib.d.ts' })
  ],
  build: {
    lib: {
      entry: normalizePath(path.resolve('src', 'index.ts')),
      formats: ['es'],
      fileName: 'my-lib.mjs'
    }
  }
});

```

And that's it!

## Configuration

You can use any of the entry point config options of [DTS Bundle Generator](https://github.com/timocov/dts-bundle-generator).

## Known limitations

This plugin handles only one entry file (as I don't need further support for my own projetcs). Feel free to let me know if you need this kind of feature.
