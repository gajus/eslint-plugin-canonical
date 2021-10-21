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
* [require identifiers to match a specified regular expression](#require-identifiers-to-match-a-specified-regular-expression)
    * [Options](#require-identifiers-to-match-a-specified-regular-expression-options)
        * [properties](#require-identifiers-to-match-a-specified-regular-expression-options-properties)
        * [classFields](#require-identifiers-to-match-a-specified-regular-expression-options-classfields)
        * [onlyDeclarations](#require-identifiers-to-match-a-specified-regular-expression-options-onlydeclarations)
        * [ignoreDestructuring: false](#require-identifiers-to-match-a-specified-regular-expression-options-ignoredestructuring-false)
        * [ignoreDestructuring: true](#require-identifiers-to-match-a-specified-regular-expression-options-ignoredestructuring-true)
        * [ignoreNamedImports: false](#require-identifiers-to-match-a-specified-regular-expression-options-ignorenamedimports-false)
        * [ignoreNamedImports: true](#require-identifiers-to-match-a-specified-regular-expression-options-ignorenamedimports-true)
    * [When Not To Use It](#require-identifiers-to-match-a-specified-regular-expression-when-not-to-use-it)


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

<a name="require-identifiers-to-match-a-specified-regular-expression"></a>
# require identifiers to match a specified regular expression

Note: This rule is equivalent to [`id-match`](https://eslint.org/docs/rules/id-match), except for addition of `ignoreNamedImports`.

This rule requires identifiers in assignments and `function` definitions to match a specified regular expression.

<a name="require-identifiers-to-match-a-specified-regular-expression-options"></a>
## Options

This rule has a string option for the specified regular expression.

For example, to enforce a camelcase naming convention:

```json
{
    "canonical/id-match": ["error", "^[a-z]+([A-Z][a-z]+)*$"]
}
```

Examples of **incorrect** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$"` option:

```js
/*eslint canonical/id-match: ["error", "^[a-z]+([A-Z][a-z]+)*$"]*/
var my_favorite_color = "#112C85";
var _myFavoriteColor  = "#112C85";
var myFavoriteColor_  = "#112C85";
var MY_FAVORITE_COLOR = "#112C85";
function do_something() {
    // ...
}
obj.do_something = function() {
    // ...
};
class My_Class {}
class myClass {
    do_something() {}
}
class myClass {
    #do_something() {}
}
```

Examples of **correct** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$"` option:

```js
/*eslint canonical/id-match: ["error", "^[a-z]+([A-Z][a-z]+)*$"]*/
var myFavoriteColor   = "#112C85";
var foo = bar.baz_boom;
var foo = { qux: bar.baz_boom };
do_something();
var obj = {
    my_pref: 1
};
class myClass {}
class myClass {
    doSomething() {}
}
class myClass {
    #doSomething() {}
}
```

This rule has an object option:

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

<a name="require-identifiers-to-match-a-specified-regular-expression-options-properties"></a>
### properties

Examples of **incorrect** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$", { "properties": true }` options:

```js
/*eslint canonical/id-match: ["error", "^[a-z]+([A-Z][a-z]+)*$", { "properties": true }]*/
var obj = {
    my_pref: 1
};
```

<a name="require-identifiers-to-match-a-specified-regular-expression-options-classfields"></a>
### classFields

Examples of **incorrect** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$", { "classFields": true }` options:

```js
/*eslint canonical/id-match: ["error", "^[a-z]+([A-Z][a-z]+)*$", { "properties": true }]*/
class myClass {
    my_pref = 1;
}
class myClass {
    #my_pref = 1;
}
```

<a name="require-identifiers-to-match-a-specified-regular-expression-options-onlydeclarations"></a>
### onlyDeclarations

Examples of **correct** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$", { "onlyDeclarations": true }` options:

```js
/*eslint canonical/id-match: [2, "^[a-z]+([A-Z][a-z]+)*$", { "onlyDeclarations": true }]*/
do_something(__dirname);
```

<a name="require-identifiers-to-match-a-specified-regular-expression-options-ignoredestructuring-false"></a>
### ignoreDestructuring: false

Examples of **incorrect** code for this rule with the default `"^[^_]+$", { "ignoreDestructuring": false }` option:

```js
/*eslint canonical/id-match: [2, "^[^_]+$", { "ignoreDestructuring": false }]*/
let { category_id } = query;
let { category_id = 1 } = query;
let { category_id: category_id } = query;
let { category_id: category_alias } = query;
let { category_id: categoryId, ...other_props } = query;
```

<a name="require-identifiers-to-match-a-specified-regular-expression-options-ignoredestructuring-true"></a>
### ignoreDestructuring: true

Examples of **incorrect** code for this rule with the `"^[^_]+$", { "ignoreDestructuring": true }` option:

```js
/*eslint canonical/id-match: [2, "^[^_]+$", { "ignoreDestructuring": true }]*/
let { category_id: category_alias } = query;
let { category_id, ...other_props } = query;
```

Examples of **correct** code for this rule with the `"^[^_]+$", { "ignoreDestructuring": true }` option:

```js
/*eslint canonical/id-match: [2, "^[^_]+$", { "ignoreDestructuring": true }]*/
let { category_id } = query;
let { category_id = 1 } = query;
let { category_id: category_id } = query;
```

<a name="require-identifiers-to-match-a-specified-regular-expression-options-ignorenamedimports-false"></a>
### ignoreNamedImports: false

Examples of **incorrect** code for this rule with the default `"^[^_]+$", { "ignoreNamedImports": false }` option:

```js
/*eslint canonical/id-match: [2, "^[^_]+$", { "ignoreNamedImports": false }]*/
import { category_id } from 'test';
```

Examples of **correct** code for this rule with the `"^[^_]+$", { "ignoreNamedImports": true }` option:

```js
/*eslint canonical/id-match: [2, "^[^_]+$", { "ignoreNamedImports": true }]*/
import { categoryId } from 'test';
```

<a name="require-identifiers-to-match-a-specified-regular-expression-options-ignorenamedimports-true"></a>
### ignoreNamedImports: true

Examples of **correct** code for this rule with the `"^[^_]+$", { "ignoreNamedImports": true }` option:

```js
/*eslint canonical/id-match: [2, "^[^_]+$", { "ignoreNamedImports": true }]*/
import { category_id } from 'test';
```



<a name="require-identifiers-to-match-a-specified-regular-expression-when-not-to-use-it"></a>
## When Not To Use It

If you don't want to enforce any particular naming convention for all identifiers, or your naming convention is too complex to be enforced by configuring this rule, then you should not enable this rule.

