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

<!-- assertions noBarrelImport -->