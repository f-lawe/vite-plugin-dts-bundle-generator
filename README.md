# DTS Bundle Generator Vite plugin

![npm](https://img.shields.io/npm/v/vite-plugin-dts-bundle-generator)
![npm](https://img.shields.io/npm/dt/vite-plugin-dts-bundle-generator)
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
Add this block in your `vite.config.ts`:

```ts
import path from 'path';
import { defineConfig, normalizePath } from 'vite';
import dtsBundleGenerator from 'vite-plugin-dts-bundle-generator';

export default defineConfig({
  plugins: [
    dtsBundleGenerator({
      fileName: 'my-lib.d.ts',
      // any other options from dts-bundle-generator
    })
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

This library handle both single and multiple entrypoints. You can use any of the config options provided by [DTS Bundle Generator](https://github.com/timocov/dts-bundle-generator).

