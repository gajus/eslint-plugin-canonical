### `no-unused-exports`

Identifies unused TypeScript exports.

> **Note** This rule is implemented using [`ts-unused-exports`](https://github.com/pzavolinsky/ts-unused-exports).

#### Options

|Config|Type|Required|Default|Description|
|---|---|---|---|---|
|`tsConfigPath`|string|Required||Path to [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)|
|`allowUnusedEnums`|boolean||`false`|Allow unused `enum`s.|
|`allowUnusedTypes`|boolean||`false`|Allow unused `type` and `interface`.|

<!-- assertions noUnusedExports -->