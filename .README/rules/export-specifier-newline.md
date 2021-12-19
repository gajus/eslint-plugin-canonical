### `export-specifier-newline`

Forces every export specifier to be on a new line.

Combine this rule with `object-curly-newline` to have every specifier on its own line.

```json
"object-curly-newline": [
  2,
  {
    "ExportDeclaration": "always"
  }
],
```

<!-- assertions exportSpecifierNewline -->
