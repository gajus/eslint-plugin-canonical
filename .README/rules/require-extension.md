### `require-extension`

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Adds `.js` extension to all imports and exports.

It resolves the following cases:

#### Relative imports

Relative imports that resolve to a file of the same name:

```js
import './foo'; // => import './foo.js';
```

Relative imports that resolve to an index file:

```js
import './foo'; // => import './foo/index.js';
```

The above examples would also work if the file extension was `.ts` or `.tsx`, i.e.

```js
import './foo'; // => import './foo.ts';
import './foo'; // => import './foo/index.tsx';
```

#### TypeScript paths

For this to work, you have to [configure `import/resolver`](https://www.npmjs.com/package/eslint-import-resolver-typescript):

```ts
settings: {
  'import/resolver': {
    typescript: {
      project: path.resolve(__dirname, 'tsconfig.json'),
    },
  },
},
```

Imports that resolve to a file of the same name:

```js
import { foo } from '@/foo'; // => import { foo } from '@/foo.js';
```

Imports that resolve to an index file:

```js
import { foo } from '@/foo'; // => import { foo } from '@/foo/index.js';
```

<!-- assertions requireExtension -->