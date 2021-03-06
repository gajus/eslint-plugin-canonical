<a name="eslint-plugin-canonical"></a>
# eslint-plugin-canonical

[![NPM version](http://img.shields.io/npm/v/eslint-plugin-canonical.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-canonical)
[![Travis build status](http://img.shields.io/travis/gajus/eslint-plugin-canonical/master.svg?style=flat-square)](https://travis-ci.com/github/gajus/eslint-plugin-canonical)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

ESLint rules for [Canonical ruleset](https://github.com/gajus/eslint-config-canonical).

* [eslint-plugin-canonical](#eslint-plugin-canonical)
    * [Installation](#eslint-plugin-canonical-installation)
    * [Configuration](#eslint-plugin-canonical-configuration)
        * [Shareable configurations](#eslint-plugin-canonical-configuration-shareable-configurations)
    * [Rules](#eslint-plugin-canonical-rules)
        * [`destructuring-property-newline`](#eslint-plugin-canonical-rules-destructuring-property-newline)
        * [`export-specifier-newline`](#eslint-plugin-canonical-rules-export-specifier-newline)
        * [`filename-match-exported`](#eslint-plugin-canonical-rules-filename-match-exported)
        * [`filename-match-regex`](#eslint-plugin-canonical-rules-filename-match-regex)
        * [`filename-no-index`](#eslint-plugin-canonical-rules-filename-no-index)
        * [`id-match`](#eslint-plugin-canonical-rules-id-match)
        * [`import-specifier-newline`](#eslint-plugin-canonical-rules-import-specifier-newline)
        * [`no-restricted-strings`](#eslint-plugin-canonical-rules-no-restricted-strings)
        * [`no-use-extend-native`](#eslint-plugin-canonical-rules-no-use-extend-native)
        * [`prefer-inline-type-import`](#eslint-plugin-canonical-rules-prefer-inline-type-import)
        * [`prefer-use-mount`](#eslint-plugin-canonical-rules-prefer-use-mount)
        * [`sort-keys`](#eslint-plugin-canonical-rules-sort-keys)


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

<a name="eslint-plugin-canonical-rules-destructuring-property-newline"></a>
### <code>destructuring-property-newline</code>

Like [`object-property-newline`](https://eslint.org/docs/rules/object-property-newline), but for destructuring.

The following patterns are considered problems:

```js
const {a,b} = obj;
// Message: undefined

const [a,b] = obj;
// Message: undefined

const {a,b,c} = obj;
// Message: undefined
// Message: undefined

const {
a,b} = obj;
// Message: undefined

({a,b}) => {};
// Message: undefined
```

The following patterns are not considered problems:

```js
const {a,
b} = obj;

const {a} = obj;

const {
a
} = obj;

({a,
b}) => {};

const [a,,b] = obj;
```



<a name="eslint-plugin-canonical-rules-export-specifier-newline"></a>
### <code>export-specifier-newline</code>

Forces every export specifier to be on a new line.

Tip: Combine this rule with `object-curly-newline` to have every specifier on its own line.

```json
"object-curly-newline": [
  2,
  {
    "ExportDeclaration": "always"
  }
],
```

Working together, both rules will produces exports such as:

```ts
export { 
  a,
  b,
  c
};
```

The following patterns are considered problems:

```js
const a = 1; const b = 2; const c = 3; export { a, b, c };
// Message: undefined
// Message: undefined

const a = 1; const b = 2; const c = 3; export { a, b, c, };
// Message: undefined
// Message: undefined

const a = 1; const b = 2; export { a as default, b }
// Message: undefined
```

The following patterns are not considered problems:

```js
export { 
 a,
b,
c
 } from 'foo'

const a = 1; const b = 2; const c = 3; export { 
 a,
b,
c
 };

export * from 'foo'
```



<a name="eslint-plugin-canonical-rules-filename-match-exported"></a>
### <code>filename-match-exported</code>

Match the file name against the default exported value in the module. Files that don't have a default export will be ignored. The exports of `index.js` are matched against their parent directory.

```js
// Considered problem only if the file isn't named foo.js or foo/index.js
export default function foo() {}

// Considered problem only if the file isn't named Foo.js or Foo/index.js
module.exports = class Foo() {}

// Considered problem only if the file isn't named someVariable.js or someVariable/index.js
module.exports = someVariable;

// Never considered a problem
export default { foo: "bar" };
```

If your filename policy doesn't quite match with your variable naming policy, you can add one or multiple transforms:

```json
"canonical/filename-match-exported": [ 2, "kebab" ]
```

Now, in your code:

```js
// Considered problem only if file isn't named variable-name.js or variable-name/index.js
export default function variableName;
```

Available transforms:

* snake
* kebab
* camel
* pascal

For multiple transforms simply specify an array like this (null in this case stands for no transform):

```json
"canonical/filename-match-exported": [2, [ null, "kebab", "snake" ] ]
```

If you prefer to use suffixes for your files (e.g. `Foo.react.js` for a React component file), you can use a second configuration parameter. It allows you to remove parts of a filename matching a regex pattern before transforming and matching against the export.

```json
"canonical/filename-match-exported": [ 2, null, "\\.react$" ]
```

Now, in your code:

```js
// Considered problem only if file isn't named variableName.react.js, variableName.js or variableName/index.js
export default function variableName;
```

If you also want to match exported function calls you can use the third option (a boolean flag).

```json
"canonical/filename-match-exported": [ 2, null, null, true ]
```

Now, in your code:

```js
// Considered problem only if file isn't named functionName.js or functionName/index.js
export default functionName();
```

The following patterns are considered problems:

```js
module.exports = exported;
// Message: Filename 'fooBar' must match the exported name 'exported'.

module.exports = class Foo {};
// Message: Filename 'foo' must match the exported name 'Foo'.

module.exports = class Foo { render() { return <span>Test Class</span>; } };
// Message: Filename 'foo' must match the exported name 'Foo'.

module.exports = function foo() {};
// Message: Filename 'bar' must match the exported name 'foo'.

module.exports = function foo() { return <span>Test Fn</span> };
// Message: Filename 'bar' must match the exported name 'foo'.

export default exported;
// Message: Filename 'fooBar' must match the exported name 'exported'.

export default class Foo {};
// Message: Filename 'bar' must match the exported name 'Foo'.

export default class Foo { render() { return <span>Test Class</span>; } };
// Message: Filename 'bar' must match the exported name 'Foo'.

export default function foo() {};
// Message: The directory 'fooBar' must be named 'foo', after the exported value of its index file.

export default function foo() { return <span>Test Fn</span> };
// Message: The directory 'fooBar' must be named 'foo', after the exported value of its index file.

module.exports = exported;
// Message: The directory 'eslint-plugin-canonical' must be named 'exported', after the exported value of its index file.

module.exports = class Foo { render() { return <span>Test Class</span>; } };
// Message: Filename 'Foo.react' must match the exported name 'Foo'.

// Options: ["snake"]
module.exports = variableName;
// Message: Filename 'variableName' must match the exported and transformed name 'variable_name'.

// Options: ["kebab"]
export default variableName;
// Message: Filename 'variableName' must match the exported and transformed name 'variable-name'.

// Options: ["pascal"]
export default variableName;
// Message: Filename 'variableName' must match the exported and transformed name 'VariableName'.

// Options: [["pascal","snake"]]
export default variableName;
// Message: Filename 'variableName' must match any of the exported and transformed names 'VariableName', 'variable_name'.

// Options: [null,"\\.react$"]
export default class Foo { render() { return <span>Test Class</span>; } };
// Message: Filename 'Foo.bar' must match the exported name 'Foo'.

// Options: [null,"\\.react$"]
export default class Foo { render() { return <span>Test Class</span>; } };
// Message: The directory 'Foo.react' must be named 'Foo', after the exported value of its index file.

// Options: [null,null,true]
module.exports = foo();
// Message: Filename 'bar' must match the exported name 'foo'.
```

The following patterns are not considered problems:

```js
module.exports = function() {};

var foo = 'bar';

export default foo();

module.exports = exported;

module.exports = class Foo {};

module.exports = class Foo { render() { return <span>Test Class</span>; } };

module.exports = function foo() {};

module.exports = foo();

module.exports = function foo() { return <span>Test Fn</span> };

export default exported;

export default class Foo {};

export default class Foo { render() { return <span>Test Class</span>; } };

export default function foo() {};

export default function foo() { return <span>Test Fn</span> };

export default function foo() {};

export default function foo() { return <span>Test Fn</span> };

export default function index() {};

// Options: ["snake"]
module.exports = variableName;

// Options: ["snake"]
module.exports = variableName;

// Options: ["kebab"]
module.exports = variableName;

// Options: ["camel"]
module.exports = variable_name;

// Options: ["snake"]
export default variableName;

// Options: ["kebab"]
export default variableName;

// Options: ["camel"]
export default variable_name;

// Options: ["pascal"]
export default variable_name;

// Options: [["pascal","camel"]]
export default variable_name;

// Options: [["pascal","camel"]]
export default variable_name;

// Options: [null,"\\.react$"]
module.exports = class Foo { render() { return <span>Test Class</span>; } };

// Options: [null,"\\.react$"]
export default class Foo { render() { return <span>Test Class</span>; } };

// Options: [null,null,true]
module.exports = foo();
```



<a name="eslint-plugin-canonical-rules-filename-match-regex"></a>
### <code>filename-match-regex</code>

A rule to enforce a certain file naming convention using a regular expression.

The convention can be configured using a regular expression (the default is `camelCase.js`). Additionally
exporting files can be ignored with a second configuration parameter.

```json
"canonical/filename-match-regex": [2, "^[a-z_]+$", true]
```

With these configuration options, `camelCase.js` will be reported as an error while `snake_case.js` will pass.
Additionally the files that have a named default export (according to the logic in the `match-exported` rule) will be
ignored.  They could be linted with the `match-exported` rule. Please note that exported function calls are not
respected in this case.

The following patterns are considered problems:

```js
var foo = 'bar';
// Message: Filename 'foo_bar.js' does not match the naming convention.

var foo = 'bar';
// Message: Filename 'fooBAR.js' does not match the naming convention.

var foo = 'bar';
// Message: Filename 'fooBar$.js' does not match the naming convention.

// Options: ["^[a-z_]$"]
var foo = 'bar';
// Message: Filename 'fooBar.js' does not match the naming convention.
```

The following patterns are not considered problems:

```js
var foo = 'bar';

var foo = 'bar';

var foo = 'bar';

// Options: ["^[a-z_]+$"]
var foo = 'bar';

// Options: ["^[a-z_]+$"]
var foo = 'bar';

var foo = 'bar';

// Options: [null,true]
module.exports = foo

// Options: ["^[a-z_]$",true]
module.exports = foo

// Options: ["^[a-z_]+$",true]
module.exports = foo()
```



<a name="eslint-plugin-canonical-rules-filename-no-index"></a>
### <code>filename-no-index</code>

Having a bunch of `index.js` files can have negative influence on developer experience, e.g. when
opening files by name. When enabling this rule. `index.js` files will always be considered a problem.

The following patterns are considered problems:

```js
var foo = 'bar';
// Message: 'index.js' files are not allowed.

var foo = 'bar';
// Message: 'index.js' files are not allowed.
```

The following patterns are not considered problems:

```js
var foo = 'bar';

var foo = 'bar';

var foo = 'bar';

var foo = 'bar';
```



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

The following patterns are considered problems:

```js
// Options: ["^[a-z]+$",{"onlyDeclarations":true}]
var __foo = "Matthieu"
// Message: undefined

// Options: ["^[a-z]+$"]
first_name = "Matthieu"
// Message: undefined

// Options: ["^z"]
first_name = "Matthieu"
// Message: undefined

// Options: ["^[a-z]+(_[A-Z][a-z])*$"]
Last_Name = "Larcher"
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
var obj = {key: no_under}
// Message: Identifier 'no_under' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$"]
function no_under21(){}
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
obj.no_under22 = function(){};
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
no_under23.foo = function(){};
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
[no_under24.baz]
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
if (foo.bar_baz === boom.bam_pow) { [no_under25.baz] }
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
foo.no_under26 = boom.bam_pow
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
var foo = { no_under27: boom.bam_pow }
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
foo.qux.no_under28 = { bar: boom.bam_pow }
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
var o = {no_under29: 1}
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
obj.no_under30 = 2;
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
var { category_id: category_alias } = query;
// Message: Identifier 'category_alias' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"ignoreDestructuring":true,"properties":true}]
var { category_id: category_alias } = query;
// Message: Identifier 'category_alias' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"ignoreDestructuring":true,"properties":true}]
var { category_id: categoryId, ...other_props } = query;
// Message: Identifier 'other_props' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
var { category_id } = query;
// Message: Identifier 'category_id' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
var { category_id = 1 } = query;
// Message: Identifier 'category_id' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
import no_camelcased from "external-module";
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
import * as no_camelcased from "external-module";
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$"]
export * as no_camelcased from "external-module";
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
import { no_camelcased as no_camel_cased } from "external module";
// Message: Identifier 'no_camel_cased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
import { camelCased as no_camel_cased } from "external module";
// Message: Identifier 'no_camel_cased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
import { camelCased, no_camelcased } from "external-module";
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
import { no_camelcased as camelCased, another_no_camelcased } from "external-module";
// Message: Identifier 'another_no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
import camelCased, { no_camelcased } from "external-module";
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
import no_camelcased, { another_no_camelcased as camelCased } from "external-module";
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
function foo({ no_camelcased }) {};
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
function foo({ no_camelcased = 'default value' }) {};
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
const no_camelcased = 0; function foo({ camelcased_value = no_camelcased }) {}
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.
// Message: Identifier 'camelcased_value' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
const { bar: no_camelcased } = foo;
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
function foo({ value_1: my_default }) {}
// Message: Identifier 'my_default' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
function foo({ isCamelcased: no_camelcased }) {};
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
var { foo: bar_baz = 1 } = quz;
// Message: Identifier 'bar_baz' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"properties":true}]
const { no_camelcased = false } = bar;
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$"]
class x { _foo() {} }
// Message: Identifier '_foo' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"classFields":true}]
class x { _foo = 1; }
// Message: Identifier '_foo' does not match the pattern '^[^_]+$'.

// Options: ["^[^_]+$",{"ignoreNamedImports":false}]
import { no_camelcased } from "external-module";
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.
```

The following patterns are not considered problems:

```js
// Options: ["^[a-z]+$",{"onlyDeclarations":true}]
__foo = "Matthieu"

// Options: ["^[a-z]+$"]
firstname = "Matthieu"

// Options: ["[a-z]+"]
first_name = "Matthieu"

// Options: ["^f"]
firstname = "Matthieu"

// Options: ["^[a-z]+(_[A-Z][a-z]+)*$"]
last_Name = "Larcher"

// Options: ["^[a-z]+(_[A-Z][a-z])*$"]
param = "none"

// Options: ["^[^_]+$"]
function noUnder(){}

// Options: ["^[^_]+$"]
no_under()

// Options: ["^[^_]+$"]
foo.no_under2()

// Options: ["^[^_]+$"]
var foo = bar.no_under3;

// Options: ["^[^_]+$"]
var foo = bar.no_under4.something;

// Options: ["^[^_]+$"]
foo.no_under5.qux = bar.no_under6.something;

// Options: ["^[^_]+$"]
if (bar.no_under7) {}

// Options: ["^[^_]+$"]
var obj = { key: foo.no_under8 };

// Options: ["^[^_]+$"]
var arr = [foo.no_under9];

// Options: ["^[^_]+$"]
[foo.no_under10]

// Options: ["^[^_]+$"]
var arr = [foo.no_under11.qux];

// Options: ["^[^_]+$"]
[foo.no_under12.nesting]

// Options: ["^[^_]+$"]
if (foo.no_under13 === boom.no_under14) { [foo.no_under15] }

// Options: ["^[a-z$]+([A-Z][a-z]+)*$"]
var myArray = new Array(); var myDate = new Date();

// Options: ["^[^_]+$"]
var x = obj._foo;

// Options: ["^[^_]+$",{"onlyDeclarations":true,"properties":true}]
var obj = {key: no_under}

// Options: ["^[^_]+$",{"properties":true}]
var {key_no_under: key} = {}

// Options: ["^[^_]+$",{"ignoreDestructuring":true,"properties":true}]
var { category_id } = query;

// Options: ["^[^_]+$",{"ignoreDestructuring":true,"properties":true}]
var { category_id: category_id } = query;

// Options: ["^[^_]+$",{"ignoreDestructuring":true,"properties":true}]
var { category_id = 1 } = query;

// Options: ["^[^_]+$",{"properties":true}]
var o = {key: 1}

// Options: ["^[^_]+$",{"properties":false}]
var o = {no_under16: 1}

// Options: ["^[^_]+$",{"properties":false}]
obj.no_under17 = 2;

// Options: ["^[^_]+$",{"properties":false}]
var obj = {
 no_under18: 1 
};
 obj.no_under19 = 2;

// Options: ["^[^_]+$",{"properties":false}]
obj.no_under20 = function(){};

// Options: ["^[^_]+$",{"properties":false}]
var x = obj._foo2;

// Options: ["^[^_]+$"]
class x { foo() {} }

// Options: ["^[^_]+$"]
class x { #foo() {} }

// Options: ["^[^_]+$",{"ignoreNamedImports":true}]
import { no_camelcased } from "external-module";
// Message: Identifier 'no_camelcased' does not match the pattern '^[^_]+$'.
```



<a name="eslint-plugin-canonical-rules-import-specifier-newline"></a>
### <code>import-specifier-newline</code>

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

The following patterns are considered problems:

```js
import {a, b} from 'foo';
// Message: undefined

import a, {b, c} from 'foo';
// Message: undefined
```

The following patterns are not considered problems:

```js
import {a,
b} from 'foo'

import a, {b,
c} from 'foo'
```



<a name="eslint-plugin-canonical-rules-no-restricted-strings"></a>
### <code>no-restricted-strings</code>

Disallow specified strings.

The following patterns are considered problems:

```js
// Options: [["bar"]]
var foo = "bar"
// Message: Disallowed string: 'bar'.

// Options: [["bar"]]
const foo = `bar ${baz}`;
// Message: Disallowed string in template: 'bar'.
```

The following patterns are not considered problems:

```js
const foo = "bar";
```


<a name="eslint-plugin-canonical-rules-no-restricted-strings-options-1"></a>
#### Options

The 1st option is an array of strings that cannot be contained in the codebase.

<a name="eslint-plugin-canonical-rules-no-use-extend-native"></a>
### <code>no-use-extend-native</code>

The following patterns are considered problems:

```js
Array.prototype.custom
// Message: Avoid using extended native objects

Array.to
// Message: Avoid using extended native objects

Array.to()
// Message: Avoid using extended native objects

[].length()
// Message: Avoid using extended native objects

'unicorn'.green
// Message: Avoid using extended native objects

[].custom()
// Message: Avoid using extended native objects

({}).custom()
// Message: Avoid using extended native objects

/match_this/.custom()
// Message: Avoid using extended native objects

'string'.custom()
// Message: Avoid using extended native objects

console.log('foo'.custom)
// Message: Avoid using extended native objects

console.log('foo'.custom())
// Message: Avoid using extended native objects

('str' + 'ing').custom()
// Message: Avoid using extended native objects

('str' + 'i' + 'ng').custom()
// Message: Avoid using extended native objects

(1 + 'ing').custom()
// Message: Avoid using extended native objects

(/regex/ + 'ing').custom()
// Message: Avoid using extended native objects

(1 + 1).toLowerCase()
// Message: Avoid using extended native objects

(1 + 1 + 1).toLowerCase()
// Message: Avoid using extended native objects

(function testFunction() {}).custom()
// Message: Avoid using extended native objects

new Array().custom()
// Message: Avoid using extended native objects

new ArrayBuffer().custom()
// Message: Avoid using extended native objects

new Boolean().custom()
// Message: Avoid using extended native objects

new DataView().custom()
// Message: Avoid using extended native objects

new Date().custom()
// Message: Avoid using extended native objects

new Error().custom()
// Message: Avoid using extended native objects

new Float32Array().custom()
// Message: Avoid using extended native objects

new Float64Array().custom()
// Message: Avoid using extended native objects

new Function().custom()
// Message: Avoid using extended native objects

new Int16Array().custom()
// Message: Avoid using extended native objects

new Int32Array().custom()
// Message: Avoid using extended native objects

new Int8Array().custom()
// Message: Avoid using extended native objects

new Map().custom()
// Message: Avoid using extended native objects

new Number().custom()
// Message: Avoid using extended native objects

new Object().custom()
// Message: Avoid using extended native objects

new Promise().custom()
// Message: Avoid using extended native objects

new RegExp().custom()
// Message: Avoid using extended native objects

new Set().custom()
// Message: Avoid using extended native objects

new String().custom()
// Message: Avoid using extended native objects

new Symbol().custom()
// Message: Avoid using extended native objects

new Uint16Array().custom()
// Message: Avoid using extended native objects

new Uint32Array().custom()
// Message: Avoid using extended native objects

new Uint8Array().custom()
// Message: Avoid using extended native objects

new Uint8ClampedArray().custom()
// Message: Avoid using extended native objects

new WeakMap().custom()
// Message: Avoid using extended native objects

new WeakSet().custom()
// Message: Avoid using extended native objects

new Array()['custom']
// Message: Avoid using extended native objects

new Array()['custom']()
// Message: Avoid using extended native objects
```

The following patterns are not considered problems:

```js
error.plugin

error.plugn()

array.custom

Object.assign()

Object.keys

Object.keys()

gulp.task()

Custom.prototype.custom

Array.prototype.map

Array.prototype.map.call([1,2,3], function (x) { console.log(x) })

Array.apply

Array.call(null, 1, 2, 3)

[].push(1)

[][0]

{}[i]

{}[3]

{}[j][k]

({foo: {bar: 1, baz: 2}}[i][j])

({}).toString()

/match_this/.test()

'foo'.length

'hi'.padEnd

'hi'.padEnd()

console.log('foo'.length)

console.log('foo'.toString)

console.log('foo'.toString())

console.log(gulp.task)

console.log(gulp.task())

'string'.toString()

(1).toFixed()

1..toFixed()

1.0.toFixed()

('str' + 'ing').toString()

('str' + 'i' + 'ng').toString()

(1 + 1).valueOf()

(1 + 1 + (1 + 1)).valueOf()

(1 + 1 + 1).valueOf()

(1 + 'string').toString()

(/regex/ + /regex/).toString()

(/regex/ + 1).toString()

([1] + [2]).toString()

(function testFunction() {}).toString()

Test.prototype

new Array().toString()

new ArrayBuffer().constructor()

new Boolean().toString()

new DataView().buffer()

new Date().getDate()

new Error().message()

new Error().stack

new Error().stack.slice(1)

new Float32Array().values()

new Float64Array().values()

new Function().toString()

new Int16Array().values()

new Int32Array().values()

new Int8Array().values()

new Map().clear()

new Number().toString()

new Object().toString()

new Object().toString

new Promise().then()

new RegExp().test()

new Set().values()

new String().toString()

new Symbol().toString()

new Uint16Array().values()

new Uint32Array().values()

new Uint8ClampedArray().values()

new WeakMap().get()

new WeakSet().has()

new Array()['length']

new Array()['toString']()
```



<a name="eslint-plugin-canonical-rules-prefer-inline-type-import"></a>
### <code>prefer-inline-type-import</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

TypeScript 4.5 introduced [type modifiers](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#type-modifiers-on-import-names) that allow to inline type imports as opposed to having dedicated `import type`. This allows to remove duplicate type imports. This rule enforces use of import type modifiers.

The following patterns are considered problems:

```js
import type {foo} from 'bar'
// Message: undefined

import type {foo, baz} from 'bar'
// Message: undefined
```

The following patterns are not considered problems:

```js
import {type foo} from 'bar'

import type Foo from 'bar'

import type * as Foo from 'bar'
```



<a name="eslint-plugin-canonical-rules-prefer-use-mount"></a>
### <code>prefer-use-mount</code>

In React, it is common to use [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) without dependencies when the intent is to run the effect only once (on mount and unmount). However, just doing that may lead to undesired side-effects, such as the effect being called twice in [Strict Mode](https://reactjs.org/docs/strict-mode.html). For this reason, it is better to use an abstraction such as [`useMount`](https://stackoverflow.com/a/72319081/368691) that handles this use case.

The following patterns are considered problems:

```js
useEffect(() => {}, [])
// Message: undefined
```

The following patterns are not considered problems:

```js
useEffect(() => {}, [foo])

useMount(() => {}, [])
```



<a name="eslint-plugin-canonical-rules-sort-keys"></a>
### <code>sort-keys</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Note: This rule is equivalent to [`sort-keys`](https://eslint.org/docs/rules/sort-keys), except that it is fixable.

This rule requires identifiers in assignments and `function` definitions to match a specified regular expression.

<a name="eslint-plugin-canonical-rules-sort-keys-options-2"></a>
#### Options

The 1st option is "asc" or "desc".

* "asc" (default) - enforce properties to be in ascending order.
* "desc" - enforce properties to be in descending order.

The 2nd option is an object which has 3 properties.

* `caseSensitive` - if true, enforce properties to be in case-sensitive order. Default is true.
* `minKeys` - Specifies the minimum number of keys that an object should have in order for the object's unsorted keys to produce an error. Default is 2, which means by default all objects with unsorted keys will result in lint errors.
* `natural` - if true, enforce properties to be in natural order. Default is false. Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically. So the number 10 comes after the number 3 in Natural Sorting.

The following patterns are considered problems:

```js
var obj = {
// comment
// comment 2
a:1,
_:2,
b:3
}
// Message: undefined

var obj = {
/* comment
 comment 2 */
a:1,
_:2,
b:3
}
// Message: undefined

var obj = {a:1, _:2, b:3} // default
// Message: undefined

var obj = {a:1, c:2, b:3}
// Message: undefined

var obj = {b_:1, a:2, b:3}
// Message: undefined

var obj = {b_:1, c:2, C:3}
// Message: undefined

var obj = {$:1, _:2, A:3, a:4}
// Message: undefined

var obj = {1:1, 2:4, A:3, '11':2}
// Message: undefined

var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined

var obj = {...z, c:1, b:1}
// Message: undefined

var obj = {...z, ...c, d:4, b:1, ...y, ...f, e:2, a:1}
// Message: undefined
// Message: undefined

var obj = {c:1, b:1, ...a}
// Message: undefined

var obj = {...z, ...a, c:1, b:1}
// Message: undefined

var obj = {...z, b:1, a:1, ...d, ...c}
// Message: undefined

// Options: ["desc"]
var obj = {...z, a:2, b:0, ...x, ...c}
// Message: undefined

// Options: ["desc"]
var obj = {...z, a:2, b:0, ...x}
// Message: undefined

// Options: ["desc"]
var obj = {...z, '':1, a:2}
// Message: undefined

var obj = {a:1, [b+c]:2, '':3}
// Message: undefined

// Options: ["desc"]
var obj = {'':1, [b+c]:2, a:3}
// Message: undefined

// Options: ["desc"]
var obj = {b:1, [f()]:2, '':3, a:4}
// Message: undefined

var obj = {a:1, b:3, [a]: -1, c:2}
// Message: undefined

var obj = {a:1, c:{y:1, x:1}, b:1}
// Message: undefined
// Message: undefined

// Options: ["asc"]
var obj = {a:1, _:2, b:3} // asc
// Message: undefined

// Options: ["asc"]
var obj = {a:1, c:2, b:3}
// Message: undefined

// Options: ["asc"]
var obj = {b_:1, a:2, b:3}
// Message: undefined

// Options: ["asc"]
var obj = {b_:1, c:2, C:3}
// Message: undefined

// Options: ["asc"]
var obj = {$:1, _:2, A:3, a:4}
// Message: undefined

// Options: ["asc"]
var obj = {1:1, 2:4, A:3, '11':2}
// Message: undefined

// Options: ["asc"]
var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined

// Options: ["asc",{"caseSensitive":false}]
var obj = {a:1, _:2, b:3} // asc, insensitive
// Message: undefined

// Options: ["asc",{"caseSensitive":false}]
var obj = {a:1, c:2, b:3}
// Message: undefined

// Options: ["asc",{"caseSensitive":false}]
var obj = {b_:1, a:2, b:3}
// Message: undefined

// Options: ["asc",{"caseSensitive":false}]
var obj = {$:1, A:3, _:2, a:4}
// Message: undefined

// Options: ["asc",{"caseSensitive":false}]
var obj = {1:1, 2:4, A:3, '11':2}
// Message: undefined

// Options: ["asc",{"caseSensitive":false}]
var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined

// Options: ["asc",{"natural":true}]
var obj = {a:1, _:2, b:3} // asc, natural
// Message: undefined

// Options: ["asc",{"natural":true}]
var obj = {a:1, c:2, b:3}
// Message: undefined

// Options: ["asc",{"natural":true}]
var obj = {b_:1, a:2, b:3}
// Message: undefined

// Options: ["asc",{"natural":true}]
var obj = {b_:1, c:2, C:3}
// Message: undefined

// Options: ["asc",{"natural":true}]
var obj = {$:1, A:3, _:2, a:4}
// Message: undefined

// Options: ["asc",{"natural":true}]
var obj = {1:1, 2:4, A:3, '11':2}
// Message: undefined

// Options: ["asc",{"natural":true}]
var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {a:1, _:2, b:3} // asc, natural, insensitive
// Message: undefined

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {a:1, c:2, b:3}
// Message: undefined

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {b_:1, a:2, b:3}
// Message: undefined

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {$:1, A:3, _:2, a:4}
// Message: undefined

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {1:1, '11':2, 2:4, A:3}
// Message: undefined

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined

// Options: ["desc"]
var obj = {a:1, _:2, b:3} // desc
// Message: undefined

// Options: ["desc"]
var obj = {a:1, c:2, b:3}
// Message: undefined

// Options: ["desc"]
var obj = {b_:1, a:2, b:3}
// Message: undefined

// Options: ["desc"]
var obj = {b_:1, c:2, C:3}
// Message: undefined

// Options: ["desc"]
var obj = {$:1, _:2, A:3, a:4}
// Message: undefined
// Message: undefined

// Options: ["desc"]
var obj = {1:1, 2:4, A:3, '11':2}
// Message: undefined
// Message: undefined

// Options: ["desc"]
var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined
// Message: undefined

// Options: ["desc",{"caseSensitive":false}]
var obj = {a:1, _:2, b:3} // desc, insensitive
// Message: undefined

// Options: ["desc",{"caseSensitive":false}]
var obj = {a:1, c:2, b:3}
// Message: undefined

// Options: ["desc",{"caseSensitive":false}]
var obj = {b_:1, a:2, b:3}
// Message: undefined

// Options: ["desc",{"caseSensitive":false}]
var obj = {b_:1, c:2, C:3}
// Message: undefined

// Options: ["desc",{"caseSensitive":false}]
var obj = {$:1, _:2, A:3, a:4}
// Message: undefined
// Message: undefined

// Options: ["desc",{"caseSensitive":false}]
var obj = {1:1, 2:4, A:3, '11':2}
// Message: undefined
// Message: undefined

// Options: ["desc",{"caseSensitive":false}]
var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined
// Message: undefined

// Options: ["desc",{"natural":true}]
var obj = {a:1, _:2, b:3} // desc, natural
// Message: undefined

// Options: ["desc",{"natural":true}]
var obj = {a:1, c:2, b:3}
// Message: undefined

// Options: ["desc",{"natural":true}]
var obj = {b_:1, a:2, b:3}
// Message: undefined

// Options: ["desc",{"natural":true}]
var obj = {b_:1, c:2, C:3}
// Message: undefined

// Options: ["desc",{"natural":true}]
var obj = {$:1, _:2, A:3, a:4}
// Message: undefined
// Message: undefined
// Message: undefined

// Options: ["desc",{"natural":true}]
var obj = {1:1, 2:4, A:3, '11':2}
// Message: undefined
// Message: undefined

// Options: ["desc",{"natural":true}]
var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined
// Message: undefined

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {a:1, _:2, b:3} // desc, natural, insensitive
// Message: undefined

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {a:1, c:2, b:3}
// Message: undefined

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {b_:1, a:2, b:3}
// Message: undefined

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {b_:1, c:2, C:3}
// Message: undefined

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {$:1, _:2, A:3, a:4}
// Message: undefined
// Message: undefined

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {1:1, 2:4, '11':2, A:3}
// Message: undefined
// Message: undefined
// Message: undefined

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {'#':1, ??:3, 'Z':2, ??:4}
// Message: undefined
// Message: undefined
```

The following patterns are not considered problems:

```js
// Options: []
var obj = {_:2, a:1, b:3} // default

// Options: []
var obj = {a:1, b:3, c:2}

// Options: []
var obj = {a:2, b:3, b_:1}

// Options: []
var obj = {C:3, b_:1, c:2}

// Options: []
var obj = {$:1, A:3, _:2, a:4}

// Options: []
var obj = {1:1, '11':2, 2:4, A:3}

// Options: []
var obj = {'#':1, 'Z':2, ??:3, ??:4}

// Options: []
var obj = {a:1, b:3, [a + b]: -1, c:2}

// Options: []
var obj = {'':1, [f()]:2, a:3}

// Options: ["desc"]
var obj = {a:1, [b++]:2, '':3}

// Options: []
var obj = {a:1, ...z, b:1}

// Options: []
var obj = {b:1, ...z, a:1}

// Options: []
var obj = {...a, b:1, ...c, d:1}

// Options: []
var obj = {...a, b:1, ...d, ...c, e:2, z:5}

// Options: []
var obj = {b:1, ...c, ...d, e:2}

// Options: []
var obj = {a:1, ...z, '':2}

// Options: ["desc"]
var obj = {'':1, ...z, 'a':2}

// Options: []
var obj = {...z, a:1, b:1}

// Options: []
var obj = {...z, ...c, a:1, b:1}

// Options: []
var obj = {a:1, b:1, ...z}

// Options: ["desc"]
var obj = {...z, ...x, a:1, ...c, ...d, f:5, e:4}

// Options: []
function fn(...args) { return [...args].length; }

// Options: []
function g() {}; function f(...args) { return g(...args); }

// Options: []
let {a, b} = {}

// Options: []
var obj = {a:1, b:{x:1, y:1}, c:1}

// Options: ["asc"]
var obj = {_:2, a:1, b:3} // asc

// Options: ["asc"]
var obj = {a:1, b:3, c:2}

// Options: ["asc"]
var obj = {a:2, b:3, b_:1}

// Options: ["asc"]
var obj = {C:3, b_:1, c:2}

// Options: ["asc"]
var obj = {$:1, A:3, _:2, a:4}

// Options: ["asc"]
var obj = {1:1, '11':2, 2:4, A:3}

// Options: ["asc"]
var obj = {'#':1, 'Z':2, ??:3, ??:4}

// Options: ["asc",{"caseSensitive":false}]
var obj = {_:2, a:1, b:3} // asc, insensitive

// Options: ["asc",{"caseSensitive":false}]
var obj = {a:1, b:3, c:2}

// Options: ["asc",{"caseSensitive":false}]
var obj = {a:2, b:3, b_:1}

// Options: ["asc",{"caseSensitive":false}]
var obj = {b_:1, C:3, c:2}

// Options: ["asc",{"caseSensitive":false}]
var obj = {b_:1, c:3, C:2}

// Options: ["asc",{"caseSensitive":false}]
var obj = {$:1, _:2, A:3, a:4}

// Options: ["asc",{"caseSensitive":false}]
var obj = {1:1, '11':2, 2:4, A:3}

// Options: ["asc",{"caseSensitive":false}]
var obj = {'#':1, 'Z':2, ??:3, ??:4}

// Options: ["asc",{"natural":true}]
var obj = {_:2, a:1, b:3} // asc, natural

// Options: ["asc",{"natural":true}]
var obj = {a:1, b:3, c:2}

// Options: ["asc",{"natural":true}]
var obj = {a:2, b:3, b_:1}

// Options: ["asc",{"natural":true}]
var obj = {C:3, b_:1, c:2}

// Options: ["asc",{"natural":true}]
var obj = {$:1, _:2, A:3, a:4}

// Options: ["asc",{"natural":true}]
var obj = {1:1, 2:4, '11':2, A:3}

// Options: ["asc",{"natural":true}]
var obj = {'#':1, 'Z':2, ??:3, ??:4}

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {_:2, a:1, b:3} // asc, natural, insensitive

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {a:1, b:3, c:2}

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {a:2, b:3, b_:1}

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {b_:1, C:3, c:2}

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {b_:1, c:3, C:2}

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {$:1, _:2, A:3, a:4}

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {1:1, 2:4, '11':2, A:3}

// Options: ["asc",{"caseSensitive":false,"natural":true}]
var obj = {'#':1, 'Z':2, ??:3, ??:4}

// Options: ["desc"]
var obj = {b:3, a:1, _:2} // desc

// Options: ["desc"]
var obj = {c:2, b:3, a:1}

// Options: ["desc"]
var obj = {b_:1, b:3, a:2}

// Options: ["desc"]
var obj = {c:2, b_:1, C:3}

// Options: ["desc"]
var obj = {a:4, _:2, A:3, $:1}

// Options: ["desc"]
var obj = {A:3, 2:4, '11':2, 1:1}

// Options: ["desc"]
var obj = {??:4, ??:3, 'Z':2, '#':1}

// Options: ["desc",{"caseSensitive":false}]
var obj = {b:3, a:1, _:2} // desc, insensitive

// Options: ["desc",{"caseSensitive":false}]
var obj = {c:2, b:3, a:1}

// Options: ["desc",{"caseSensitive":false}]
var obj = {b_:1, b:3, a:2}

// Options: ["desc",{"caseSensitive":false}]
var obj = {c:2, C:3, b_:1}

// Options: ["desc",{"caseSensitive":false}]
var obj = {C:2, c:3, b_:1}

// Options: ["desc",{"caseSensitive":false}]
var obj = {a:4, A:3, _:2, $:1}

// Options: ["desc",{"caseSensitive":false}]
var obj = {A:3, 2:4, '11':2, 1:1}

// Options: ["desc",{"caseSensitive":false}]
var obj = {??:4, ??:3, 'Z':2, '#':1}

// Options: ["desc",{"natural":true}]
var obj = {b:3, a:1, _:2} // desc, natural

// Options: ["desc",{"natural":true}]
var obj = {c:2, b:3, a:1}

// Options: ["desc",{"natural":true}]
var obj = {b_:1, b:3, a:2}

// Options: ["desc",{"natural":true}]
var obj = {c:2, b_:1, C:3}

// Options: ["desc",{"natural":true}]
var obj = {a:4, A:3, _:2, $:1}

// Options: ["desc",{"natural":true}]
var obj = {A:3, '11':2, 2:4, 1:1}

// Options: ["desc",{"natural":true}]
var obj = {??:4, ??:3, 'Z':2, '#':1}

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {b:3, a:1, _:2} // desc, natural, insensitive

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {c:2, b:3, a:1}

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {b_:1, b:3, a:2}

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {c:2, C:3, b_:1}

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {C:2, c:3, b_:1}

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {a:4, A:3, _:2, $:1}

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {A:3, '11':2, 2:4, 1:1}

// Options: ["desc",{"caseSensitive":false,"natural":true}]
var obj = {??:4, ??:3, 'Z':2, '#':1}
```



