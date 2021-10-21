<a name="eslint-plugin-canonical"></a>
# eslint-plugin-canonical

[![NPM version](http://img.shields.io/npm/v/eslint-plugin-canonical.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-canonical)
[![Travis build status](http://img.shields.io/travis/gajus/eslint-plugin-canonical/master.svg?style=flat-square)](https://travis-ci.com/github/gajus/eslint-plugin-canonical)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

ESLint rules for Canonical ruleset.

* [eslint-plugin-canonical](#eslint-plugin-canonical)
    * [Installation](#eslint-plugin-canonical-installation)
    * [Configuration](#eslint-plugin-canonical-configuration)
        * [Shareable configurations](#eslint-plugin-canonical-configuration-shareable-configurations)
    * [Rules](#eslint-plugin-canonical-rules)
        * [`id-match`](#eslint-plugin-canonical-rules-id-match)


<a name="eslint-plugin-canonical-installation"></a>
## Installation

<!-- -->

```bash
npm install eslint --save-dev
npm install @babel/eslint-parser --save-dev
npm install eslint-plugin-canonical --save-dev
```

<a name="eslint-plugin-canonical-configuration"></a>
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

<a name="eslint-plugin-canonical-configuration-shareable-configurations"></a>
### Shareable configurations

<a name="eslint-plugin-canonical-configuration-shareable-configurations-recommended"></a>
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


<a name="eslint-plugin-canonical-rules"></a>
## Rules

<!-- Rules are sorted alphabetically. -->

<a name="eslint-plugin-canonical-rules-id-match"></a>
### <code>id-match</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Note: This rule is equivalent to [`id-match`](https://eslint.org/docs/rules/id-match), except for addition of `ignoreNamedImports`.

This rule requires identifiers in assignments and `function` definitions to match a specified regular expression.

<a name="eslint-plugin-canonical-rules-id-match-options"></a>
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



