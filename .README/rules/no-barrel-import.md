### `no-barrel-import`

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Requires that resources are imported from the same files in which they are defined.

This rule converts the following:

```ts
// foo.ts
import { bar } from './bar';
// bar.ts
export { baz as bar } from './baz';
// baz.ts
export const baz = 'BAZ';
```

to:

```ts
// foo.ts
import { baz as bar } from './baz';
// baz.ts
export const baz = 'BAZ';
```

This rule handles

* named imports
* default imports
* aliased imports

You must configure `import/parsers` and `import/resolver` for this rule to work, e.g.

```ts
settings: {
  'import/parsers': {
    '@typescript-eslint/parser': ['.ts', '.tsx'],
  },
  'import/resolver': {
    typescript: {
      project: path.resolve(
        __dirname,
        'tsconfig.json',
      ),
    },
  },
},
```

<!-- assertions noBarrelImport -->