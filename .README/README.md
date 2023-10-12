# eslint-plugin-canonical

[![NPM version](http://img.shields.io/npm/v/eslint-plugin-canonical.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-canonical)
[![Travis build status](http://img.shields.io/travis/gajus/eslint-plugin-canonical/master.svg?style=flat-square)](https://travis-ci.com/github/gajus/eslint-plugin-canonical)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

ESLint rules for [Canonical ruleset](https://github.com/gajus/eslint-config-canonical).

## Installation

<!-- -->

```bash
npm install eslint --save-dev
npm install @typescript-eslint/parser --save-dev
npm install eslint-plugin-canonical --save-dev
```

## Configuration

1. Set `parser` property to `@typescript-eslint/parser`.
1. Add `plugins` section and specify `eslint-plugin-canonical` as a plugin.
1. Enable rules.

<!-- -->

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "canonical"
  ],
  "rules": {
    "canonical/filename-match-exported": 0,
    "canonical/filename-match-regex": 0,
    "canonical/filename-no-index": 0,
    "canonical/id-match": [
      2,
      "(^[A-Za-z]+(?:[A-Z][a-z]*)*\\d*$)|(^[A-Z]+(_[A-Z]+)*(_\\d$)*$)|(^(_|\\$)$)",
      {
        "ignoreDestructuring": true,
        "ignoreNamedImports": true,
        "onlyDeclarations": true,
        "properties": true
      }
    ],
    "canonical/no-restricted-strings": 0,
    "canonical/no-use-extend-native": 2,
    "canonical/prefer-inline-type-import": 2,
    "canonical/sort-keys": [
      2,
      "asc",
      {
        "caseSensitive": false,
        "natural": true
      }
    ]
  }
}
```

### Shareable configurations

#### Recommended

This plugin exports a [recommended configuration](./src/configs/recommended.json) that enforces Canonical type good practices.

To enable this configuration use the extends property in your `.eslintrc` config file:

```json
{
  "extends": [
    "plugin:canonical/recommended"
  ],
  "plugins": [
    "canonical"
  ]
}
```

See [ESLint documentation](https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files) for more information about extending configuration files.

## Rules

<!-- Rules are sorted alphabetically. -->

{"gitdown": "include", "file": "./rules/destructuring-property-newline.md"}
{"gitdown": "include", "file": "./rules/export-specifier-newline.md"}
{"gitdown": "include", "file": "./rules/filename-match-exported.md"}
{"gitdown": "include", "file": "./rules/filename-match-regex.md"}
{"gitdown": "include", "file": "./rules/filename-no-index.md"}
{"gitdown": "include", "file": "./rules/id-match.md"}
{"gitdown": "include", "file": "./rules/import-specifier-newline.md"}
{"gitdown": "include", "file": "./rules/no-barrel-import.md"}
{"gitdown": "include", "file": "./rules/no-export-all.md"}
{"gitdown": "include", "file": "./rules/no-reassign-imports.md"}
{"gitdown": "include", "file": "./rules/no-restricted-imports.md"}
{"gitdown": "include", "file": "./rules/no-restricted-strings.md"}
{"gitdown": "include", "file": "./rules/no-unused-exports.md"}
{"gitdown": "include", "file": "./rules/no-use-extend-native.md"}
{"gitdown": "include", "file": "./rules/prefer-import-alias.md"}
{"gitdown": "include", "file": "./rules/prefer-inline-type-import.md"}
{"gitdown": "include", "file": "./rules/prefer-react-lazy.md"}
{"gitdown": "include", "file": "./rules/prefer-use-mount.md"}
{"gitdown": "include", "file": "./rules/require-extension.md"}
{"gitdown": "include", "file": "./rules/sort-keys.md"}
{"gitdown": "include", "file": "./rules/virtual-module.md"}

## FAQ

### Why is the `@typescript-eslint/parser`?

This ESLint plugin is written using `@typescript-eslint/utils`, which assume that `@typescript-eslint/parser` is used.

Some rules may work without `@typescript-eslint/parser`. However, rules are implemented and tested assuming that `@typescript-eslint/parser` is used.