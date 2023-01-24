### `prefer-import-alias`

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Restrict imports to path aliases or relative imports limited by depth.

The same alias can be applied using multiple rules, e.g.

```ts
'canonical/prefer-import-alias': [
  2,
  {
    aliases: [
      {
        alias: '@/',
        matchParent: path.resolve(__dirname, 'src'),
        matchPath: '^src\\/',
      },
      {
        alias: '@/',
        matchPath: '^src\\/',
        maxRelativeDepth: 2,
      },
    ],
  },
],
```

In this example, we are saying:

* rewrite import path to use alias when
  * import path matches `^src\/`
  * the grandfather directory is `path.resolve(__dirname, 'src')`
* rewrite import path to use alias when
  * import path matches `^src\/`
  * relative import is greater than 2

The grandfather directory is essentially whichever directory that is accessed by the doubledot (`../`) by the import path.

<!-- assertions preferImportAlias -->
