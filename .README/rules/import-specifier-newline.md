### `import-specifier-newline`

Forces every import specifier to be on a new line.

Tip: Combine this rule with `object-curly-newline` to have every specifier on its own line.

```json
"object-curly-newline": [
  2,
  {
    "ImportDeclaration": "always"
  }
],
```

Working together, both rules will produces imports such as:

```ts
import { 
  a,
  b,
  c
} from 'foo';
```

<!-- assertions importSpecifierNewline -->
