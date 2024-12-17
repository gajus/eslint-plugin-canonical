### `no-restricted-imports`

Disallow specified modules when loaded by `import`

This rule is similar to [`no-restricted-imports`](https://eslint.org/docs/latest/rules/no-restricted-imports) except that it allows you to specify unique messages for each restricted import (a workaround for issue [issues#15261](https://github.com/eslint/eslint/issues/15261)).

> **Note:** Unlike the ESLint rule, this rule does not support the `patterns` option and it does not handle exports.

<!-- assertions noRestrictedImports -->