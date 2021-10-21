# eslint-plugin-canonical

[![NPM version](http://img.shields.io/npm/v/eslint-plugin-canonical.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-canonical)
[![Travis build status](http://img.shields.io/travis/gajus/eslint-plugin-canonical/master.svg?style=flat-square)](https://travis-ci.com/github/gajus/eslint-plugin-canonical)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

ESLint rules for Canonical ruleset.

{"gitdown": "contents"}

## Installation

<!-- -->

```bash
npm install eslint --save-dev
npm install @babel/eslint-parser --save-dev
npm install eslint-plugin-canonical --save-dev
```

## Configuration

1. Set `parser` property to `babel-eslint`.
1. Add `plugins` section and specify `eslint-plugin-canonical` as a plugin.
1. Enable rules.

<!-- -->

```json
{
  "parser": "@babel/eslint-parser",
  "plugins": [
    "canonical"
  ],
  "rules": {
    "canonical/id-match": 0
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

{"gitdown": "include", "file": "./rules/id-match.md"}
