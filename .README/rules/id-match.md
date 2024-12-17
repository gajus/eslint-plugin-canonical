### `id-match`

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Note: This rule is equivalent to [`id-match`](https://eslint.org/docs/rules/id-match), except for addition of `ignoreNamedImports`.

This rule requires identifiers in assignments and `function` definitions to match a specified regular expression.

#### Options

* `"properties": false` (default) does not check object properties
* `"properties": true` requires object literal properties and member expression assignment properties to match the specified regular expression
* `"classFields": false` (default) does not class field names
* `"classFields": true` requires class field names to match the specified regular expression
* `"onlyDeclarations": false` (default) requires all variable names to match the specified regular expression
* `"onlyDeclarations": true` requires only `var`, `function`, and `class` declarations to match the specified regular expression
* `"ignoreDestructuring": false` (default) enforces `id-match` for destructured identifiers
* `"ignoreDestructuring": true` does not check destructured identifiers
* `"ignoreNamedImports": false` (default) enforces `id-match` for named imports
* `"ignoreNamedImports": true` does not check named imports

<!-- assertions idMatch -->
