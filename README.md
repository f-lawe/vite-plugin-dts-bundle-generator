# unstorage-pinia-plugin

Persist and hydrate your pinia state using [unstorage](https://github.com/unjs/unstorage)!

## Install
```sh
# npm
npm i unstorage unstorage-pinia-plugin

# yarn
yarn add unstorage unstorage-pinia-plugin
```

## Usage
You can use any available [unstorage driver](https://github.com/unjs/unstorage#drivers). Drivers can be set either globally or per store. Locally defined driver overrides global definition.

Global driver:
```ts
// pinia.ts
import { createPinia } from 'pinia';
import { createUnstoragePlugin } from 'unstorage-pinia-plugin';
import localStorageDriver from 'unstorage/drivers/localstorage';

const pinia = createPinia();

pinia.use(createUnstoragePlugin({
  // unstorage plugin options
}));

export default pinia;
```

Per store driver:
```ts
// pinia.ts
import { createPinia } from 'pinia';
import { createUnstoragePlugin } from 'unstorage-pinia-plugin';

const pinia = createPinia();

pinia.use(createUnstoragePlugin());

export default pinia;
```

```ts
// store.ts
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { defineStoreStorage } from 'unstorage-pinia-plugin';
import localStorageDriver from 'unstorage/drivers/localstorage';

export const useStore = defineStore(
  'store',
  () => {
    // setup and return your state, getters and actions
  },
  {
    unstorage: {
      // unstorage store options
    }
  }
});
```

If you prefer the option way:
```ts
import { defineUnstore } from 'unstorage-pinia-plugin';
import localStorageDriver from 'unstorage/drivers/localstorage';

export const useStore = defineUnstore(
  'store',
  {
    // define your state, getters and actions
  },
  {
    // unstorage store options
  }
);
```

## Configuration

### Plugin options
- `driver: Driver` : Default unstorage driver (see [list](https://github.com/unjs/unstorage#drivers)).

### Store options
- `driver: Driver` : Driver for the store (see [list](https://github.com/unjs/unstorage#drivers)).

- `filter?: Array<string>` : State keys you actually want to persist. All keys are pushed by default.
