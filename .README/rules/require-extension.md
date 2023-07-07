### `require-extension`

Adds `.js` extension to all imports and exports.

It resolves the following cases:

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



<!-- assertions requireExtension -->