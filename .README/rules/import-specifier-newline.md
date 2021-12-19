### `import-specifier-newline`

Forces every import specifier to be on a new line.

Combine this rule with `object-curly-newline` to have every specifier on its own line.

```json
"object-curly-newline": [
  2,
  {
    "ImportDeclaration": "always"
  }
],
```

<!-- assertions importSpecifierNewline -->
