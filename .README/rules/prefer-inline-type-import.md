### `prefer-inline-type-import`

_The `--fix` option on the command line automatically fixes problems reported by this rule._

TypeScript 4.5 introduced [type modifiers](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#type-modifiers-on-import-names) that allow to inline type imports as opposed to having dedicated `import type`. This allows to remove duplicate type imports. This rule enforces use of import type modifiers.

<!-- assertions preferInlineTypeImport -->
