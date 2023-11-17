<a name="user-content-eslint-plugin-canonical"></a>
<a name="eslint-plugin-canonical"></a>
# eslint-plugin-canonical

[![NPM version](http://img.shields.io/npm/v/eslint-plugin-canonical.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-canonical)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

ESLint rules for [Canonical ruleset](https://github.com/gajus/eslint-config-canonical).

<a name="user-content-eslint-plugin-canonical-installation"></a>
<a name="eslint-plugin-canonical-installation"></a>
## Installation

<!-- -->

```bash
npm install eslint --save-dev
npm install @typescript-eslint/parser --save-dev
npm install eslint-plugin-canonical --save-dev
```

<a name="user-content-eslint-plugin-canonical-configuration"></a>
<a name="eslint-plugin-canonical-configuration"></a>
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

<a name="user-content-eslint-plugin-canonical-configuration-shareable-configurations"></a>
<a name="eslint-plugin-canonical-configuration-shareable-configurations"></a>
### Shareable configurations

<a name="user-content-eslint-plugin-canonical-configuration-shareable-configurations-recommended"></a>
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

<a name="user-content-eslint-plugin-canonical-rules"></a>
<a name="eslint-plugin-canonical-rules"></a>
## Rules

<!-- Rules are sorted alphabetically. -->

<a name="user-content-eslint-plugin-canonical-rules-destructuring-property-newline"></a>
<a name="eslint-plugin-canonical-rules-destructuring-property-newline"></a>
### <code>destructuring-property-newline</code>

Like [`object-property-newline`](https://eslint.org/docs/rules/object-property-newline), but for destructuring.

<details><summary>📖 Examples</summary>
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

// Options: [{"allowAllPropertiesOnSameLine":true}]
const {a,b} = obj;

// Options: [{"allowAllPropertiesOnSameLine":true}]
const [a,b] = obj;

const {a} = obj;

const {
a
} = obj;

({a,
b}) => {};

const [a,,b] = obj;
```

</details>


<a name="user-content-eslint-plugin-canonical-rules-export-specifier-newline"></a>
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

<details><summary>📖 Examples</summary>
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

</details>


<a name="user-content-eslint-plugin-canonical-rules-filename-match-exported"></a>
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
"canonical/filename-match-exported": [ 2, { "transforms": "kebab" } ]
```

Now, in your code:

```js
// Considered problem only if file isn't named variable-name.js or variable-name/index.js
export default function variableName;
```

Available transforms:

* `snake`
* `kebab`
* `camel`
* `pascal`

For multiple transforms simply specify an array like this (null in this case stands for no transform):

```json
"canonical/filename-match-exported": [2, { "transforms": [ null, "kebab", "snake" ] } ]
```

If you prefer to use suffixes for your files (e.g. `Foo.react.js` for a React component file), you can use a second configuration parameter. It allows you to remove parts of a filename matching a regex pattern before transforming and matching against the export.

```json
"canonical/filename-match-exported": [ 2, { "suffix": "\\.react$" } ]
```

Now, in your code:

```js
// Considered problem only if file isn't named variableName.react.js, variableName.js or variableName/index.js
export default function variableName;
```

If you also want to match exported function calls you can use the third option (a boolean flag).

```json
"canonical/filename-match-exported": [ 2, { "matchCallExpression": true } ]
```

Now, in your code:

```js
// Considered problem only if file isn't named functionName.js or functionName/index.js
export default functionName();
```

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
module.exports = exported;
// Message: undefined

module.exports = class Foo {};
// Message: undefined

module.exports = class Foo { render() { return <span>Test Class</span>; } };
// Message: undefined

module.exports = function foo() {};
// Message: undefined

module.exports = function foo() { return <span>Test Fn</span> };
// Message: undefined

export default exported;
// Message: undefined

export default class Foo {};
// Message: undefined

export default class Foo { render() { return <span>Test Class</span>; } };
// Message: undefined

export default function foo() {};
// Message: undefined

export default function foo() { return <span>Test Fn</span> };
// Message: undefined

module.exports = exported;
// Message: undefined

module.exports = class Foo { render() { return <span>Test Class</span>; } };
// Message: undefined

// Options: [{"transforms":"snake"}]
module.exports = variableName;
// Message: undefined

// Options: [{"transforms":"kebab"}]
export default variableName;
// Message: undefined

// Options: [{"transforms":"pascal"}]
export default variableName;
// Message: undefined

// Options: [{"transforms":["pascal","snake"]}]
export default variableName;
// Message: undefined

// Options: [{"suffix":"\\.react$"}]
export default class Foo { render() { return <span>Test Class</span>; } };
// Message: undefined

// Options: [{"suffix":"\\.react$"}]
export default class Foo { render() { return <span>Test Class</span>; } };
// Message: undefined

// Options: [{"matchCallExpression":true}]
module.exports = foo();
// Message: undefined
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

// Options: [{"transforms":"snake"}]
module.exports = variableName;

// Options: [{"transforms":"snake"}]
module.exports = variableName;

// Options: [{"transforms":"kebab"}]
module.exports = variableName;

// Options: [{"transforms":"camel"}]
module.exports = variable_name;

// Options: [{"transforms":"snake"}]
export default variableName;

// Options: [{"transforms":"kebab"}]
export default variableName;

// Options: [{"transforms":"camel"}]
export default variable_name;

// Options: [{"transforms":"pascal"}]
export default variable_name;

// Options: [{"transforms":["pascal","camel"]}]
export default variable_name;

// Options: [{"transforms":["pascal","camel"]}]
export default variable_name;

// Options: [{"suffix":"\\.react$"}]
module.exports = class Foo { render() { return <span>Test Class</span>; } };

// Options: [{"suffix":"\\.react$"}]
export default class Foo { render() { return <span>Test Class</span>; } };

// Options: [{"matchCallExpression":true}]
module.exports = foo();
```

</details>


<a name="user-content-eslint-plugin-canonical-rules-filename-match-regex"></a>
<a name="eslint-plugin-canonical-rules-filename-match-regex"></a>
### <code>filename-match-regex</code>

Enforce a certain file naming convention using a regular expression.

The convention can be configured using a regular expression (the default is `camelCase.js`). Additionally
exporting files can be ignored with a second configuration parameter.

```json
"canonical/filename-match-regex": [2, { "regex": "^[a-z_]+$", "ignoreExporting": true }]
```

With these configuration options, `camelCase.js` will be reported as an error while `snake_case.js` will pass.
Additionally the files that have a named default export (according to the logic in the `match-exported` rule) will be
ignored.  They could be linted with the `match-exported` rule. Please note that exported function calls are not
respected in this case.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
var foo = 'bar';
// Message: undefined

var foo = 'bar';
// Message: undefined

var foo = 'bar';
// Message: undefined

// Options: [{"regex":"^[a-z_]$"}]
var foo = 'bar';
// Message: undefined
```

The following patterns are not considered problems:

```js
var foo = 'bar';

var foo = 'bar';

var foo = 'bar';

// Options: [{"regex":"^[a-z_]+$"}]
var foo = 'bar';

// Options: [{"regex":"^[a-z_]+$"}]
var foo = 'bar';

var foo = 'bar';

// Options: [{"ignoreExporting":true}]
module.exports = foo

// Options: [{"ignoreExporting":true,"regex":"^[a-z_]$"}]
module.exports = foo

// Options: [{"ignoreExporting":true,"regex":"^[a-z_]+$"}]
module.exports = foo()
```

</details>


<a name="user-content-eslint-plugin-canonical-rules-filename-no-index"></a>
<a name="eslint-plugin-canonical-rules-filename-no-index"></a>
### <code>filename-no-index</code>

Having a bunch of `index.js` files can have negative influence on developer experience, e.g. when
opening files by name. When enabling this rule. `index.js` files will always be considered a problem.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
var foo = 'bar';
// Message: undefined

var foo = 'bar';
// Message: undefined
```

The following patterns are not considered problems:

```js
var foo = 'bar';

var foo = 'bar';

var foo = 'bar';

var foo = 'bar';
```

</details>


<a name="user-content-eslint-plugin-canonical-rules-id-match"></a>
<a name="eslint-plugin-canonical-rules-id-match"></a>
### <code>id-match</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Note: This rule is equivalent to [`id-match`](https://eslint.org/docs/rules/id-match), except for addition of `ignoreNamedImports`.

This rule requires identifiers in assignments and `function` definitions to match a specified regular expression.

<a name="user-content-eslint-plugin-canonical-rules-id-match-options"></a>
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

<details><summary>📖 Examples</summary>
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
// Message: undefined

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
// Message: undefined

// Options: ["^[^_]+$",{"ignoreDestructuring":true,"properties":true}]
var { category_id: category_alias } = query;
// Message: undefined

// Options: ["^[^_]+$",{"ignoreDestructuring":true,"properties":true}]
var { category_id: categoryId, ...other_props } = query;
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
var { category_id } = query;
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
var { category_id = 1 } = query;
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
import no_camelcased from "external-module";
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
import * as no_camelcased from "external-module";
// Message: undefined

// Options: ["^[^_]+$"]
export * as no_camelcased from "external-module";
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
import { no_camelcased as no_camel_cased } from "external module";
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
import { camelCased as no_camel_cased } from "external module";
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
import { camelCased, no_camelcased } from "external-module";
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
import { no_camelcased as camelCased, another_no_camelcased } from "external-module";
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
import camelCased, { no_camelcased } from "external-module";
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
import no_camelcased, { another_no_camelcased as camelCased } from "external-module";
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
function foo({ no_camelcased }) {};
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
function foo({ no_camelcased = 'default value' }) {};
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
const no_camelcased = 0; function foo({ camelcased_value = no_camelcased }) {}
// Message: undefined
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
const { bar: no_camelcased } = foo;
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
function foo({ value_1: my_default }) {}
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
function foo({ isCamelcased: no_camelcased }) {};
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
var { foo: bar_baz = 1 } = quz;
// Message: undefined

// Options: ["^[^_]+$",{"properties":true}]
const { no_camelcased = false } = bar;
// Message: undefined

// Options: ["^[^_]+$"]
class x { _foo() {} }
// Message: undefined

// Options: ["^[^_]+$",{"classFields":true}]
class x { _foo = 1; }
// Message: undefined

// Options: ["^[^_]+$",{"ignoreNamedImports":false}]
import { no_camelcased } from "external-module";
// Message: undefined
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

// Options: ["^[a-zA-Z\\d]+$"]

        const {
          index,
          '0': n0,
          '1': n1,
        } = exampleCode;
      
```

</details>


<a name="user-content-eslint-plugin-canonical-rules-import-specifier-newline"></a>
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

<details><summary>📖 Examples</summary>
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

</details>


<a name="user-content-eslint-plugin-canonical-rules-no-barrel-import"></a>
<a name="eslint-plugin-canonical-rules-no-barrel-import"></a>
### <code>no-barrel-import</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Requires that resources are imported from the same files in which they are defined.

This rule converts the following:

```ts
// foo.ts
import { bar } from './bar';
// bar.ts
export { baz as bar } from './baz';
// baz.ts
export const baz = 'BAZ';
```

to:

```ts
// foo.ts
import { baz as bar } from './baz';
// baz.ts
export const baz = 'BAZ';
```

This rule handles

* named imports
* default imports
* aliased imports

You must configure `import/parsers` and `import/resolver` for this rule to work, e.g.

```ts
settings: {
  'import/parsers': {
    '@typescript-eslint/parser': ['.ts', '.tsx'],
  },
  'import/resolver': {
    typescript: {
      project: path.resolve(
        __dirname,
        'tsconfig.json',
      ),
    },
  },
},
```

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/invalid/barrelImport/tsconfig.json"}}}
import { foo } from './bar';

// Message: undefined

// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/invalid/barrelImportAliased/tsconfig.json"}}}
import { foo as FOO } from './bar';

// Message: undefined

// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/invalid/barrelImportAliasedReexport/tsconfig.json"}}}
import { bar } from './bar';

// Message: undefined

// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/invalid/barrelImportDeep/tsconfig.json"}}}
import { foo } from './baz';

// Message: undefined

// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/invalid/barrelImportDefault/tsconfig.json"}}}
import foo from './bar';

// Message: undefined

// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/invalid/barrelTypeImport/tsconfig.json"}}}
import { type Foo } from './bar';

// Message: undefined

// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/invalid/mixedImport/tsconfig.json"}}}
import { foo, bar } from './bar';

// Message: undefined
```

The following patterns are not considered problems:

```js
// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/valid/directImport/tsconfig.json"}}}
import { foo } from './foo';


// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/valid/directImportDefault/tsconfig.json"}}}
import foo from './foo';


// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noBarrelImport/valid/packageImport/tsconfig.json"}}}
import { logLevels } from 'roarr';

```

</details>

<a name="user-content-eslint-plugin-canonical-rules-no-export-all"></a>
<a name="eslint-plugin-canonical-rules-no-export-all"></a>
### <code>no-export-all</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Requite that re-exports are named.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noExportAll/invalid/namespaceExport/tsconfig.json"}}}
export * from './foo';

// Message: undefined

// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noExportAll/invalid/reExport/tsconfig.json"}}}
export * from './foo';

// Message: undefined
```

The following patterns are not considered problems:

```js
// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noExportAll/valid/namedExport/tsconfig.json"}}}
export { FOO } from './foo';


// Settings: {"import/parsers":{"@typescript-eslint/parser":[".ts",".tsx"]},"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noExportAll/valid/aliasedReExport/tsconfig.json"}}}
export * as foo from './foo';

```

</details>


<a name="user-content-eslint-plugin-canonical-rules-no-import-namespace-destructure"></a>
<a name="eslint-plugin-canonical-rules-no-import-namespace-destructure"></a>
### <code>no-import-namespace-destructure</code>

Disallows the practice of importing an entire module's namespace using import * as Namespace and then destructuring specific exports from it. Instead, it encourages direct importing of only the necessary named exports from a module.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
import * as bar from 'bar'; const { foo } = bar;
// Message: undefined
```

The following patterns are not considered problems:

```js
import * as bar from 'bar'
```

</details>


<a name="user-content-eslint-plugin-canonical-rules-no-re-export"></a>
<a name="eslint-plugin-canonical-rules-no-re-export"></a>
### <code>no-re-export</code>

Disallows re-exports of imports.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js

          import Button1 from 'app/CustomButton';
          export const CustomButton = Button1;
        
// Message: undefined


          import { Button as CustomButton2 } from 'app/CustomButton';
          export const CustomButton = CustomButton2;
        
// Message: undefined


          import * as Button3 from "app/Button";
          export const CustomButton = Button3;
        
// Message: undefined


          import Button4 from 'app/CustomButton';
          export default Button4;
        
// Message: undefined


          export { default as Button5 } from 'app/CustomButton';
        
// Message: undefined


          import Button6 from 'app/CustomButton';
          export {
            Button6
          };
        
// Message: undefined


          import Button7 from 'app/CustomButton';
          export const Buttons = {
            Button: Button7
          };
        
// Message: undefined


          import Button8 from 'app/CustomButton';
          export default Button8;
          export { Button8 }
        
// Message: undefined
// Message: undefined


          export * from 'app/CustomButton';
        
// Message: undefined
```

</details>


> [!NOTE]
> This rule was originally developed by @christianvuerings as part of https://github.com/christianvuerings/eslint-plugin-no-re-export
<a name="user-content-eslint-plugin-canonical-rules-no-reassign-imports"></a>
<a name="eslint-plugin-canonical-rules-no-reassign-imports"></a>
### <code>no-reassign-imports</code>

Restricts re-assigning imports to variables that are exported.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
import { Foo } from './Foo';

export const Bar = {
  Foo,
};

// Message: undefined

import { Foo } from './Foo';

export default {
  Foo,
};

// Message: undefined
```

</details>

<a name="user-content-eslint-plugin-canonical-rules-no-restricted-imports"></a>
<a name="eslint-plugin-canonical-rules-no-restricted-imports"></a>
### <code>no-restricted-imports</code>

Disallow specified modules when loaded by `import`

This rule is similar to [`no-restricted-imports`](https://eslint.org/docs/latest/rules/no-restricted-imports) except that it allows you to specify unique messages for each restricted import (a workaround for issue [issues#15261](https://github.com/eslint/eslint/issues/15261)).

> **Note:** Unlike the ESLint rule, this rule does not support the `patterns` option and it does not handle exports.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
// Options: [{"paths":[{"importName":"*","message":"foo is restricted","name":"bar"}]}]
import * as bar from 'bar'
// Message: undefined

// Options: [{"paths":[{"importName":"foo","message":"foo is restricted","name":"bar"}]}]
import { foo } from 'bar'
// Message: undefined

// Options: [{"paths":[{"importName":"default","message":"foo is restricted","name":"bar"}]}]
import { default as bar } from 'bar'
// Message: undefined

// Options: [{"paths":[{"message":"foo is restricted","name":"bar"}]}]
import bar from 'bar'
// Message: undefined
```

The following patterns are not considered problems:

```js
// Options: [{"paths":[{"importName":"foo","message":"foo is restricted","name":"bar"}]}]
import { bar } from 'bar'
```

</details>

<a name="user-content-eslint-plugin-canonical-rules-no-restricted-strings"></a>
<a name="eslint-plugin-canonical-rules-no-restricted-strings"></a>
### <code>no-restricted-strings</code>

Disallow specified strings.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
// Options: [["bar"]]
var foo = "bar"
// Message: undefined

// Options: [["bar"]]
const foo = `bar ${baz}`;
// Message: undefined
```

The following patterns are not considered problems:

```js
const foo = "bar";
```

</details>

<a name="user-content-eslint-plugin-canonical-rules-no-restricted-strings-options-1"></a>
<a name="eslint-plugin-canonical-rules-no-restricted-strings-options-1"></a>
#### Options

The 1st option is an array of strings that cannot be contained in the codebase.

<a name="user-content-eslint-plugin-canonical-rules-no-unused-exports"></a>
<a name="eslint-plugin-canonical-rules-no-unused-exports"></a>
### <code>no-unused-exports</code>

Identifies unused TypeScript exports.

> **Note** This rule is implemented using [`ts-unused-exports`](https://github.com/pzavolinsky/ts-unused-exports).

<a name="user-content-eslint-plugin-canonical-rules-no-unused-exports-options-2"></a>
<a name="eslint-plugin-canonical-rules-no-unused-exports-options-2"></a>
#### Options

|Config|Type|Required|Default|Description|
|---|---|---|---|---|
|`tsConfigPath`|string|Required||Path to [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)|
|`allowUnusedEnums`|boolean||`false`|Allow unused `enum`s.|
|`allowUnusedTypes`|boolean||`false`|Allow unused `type` and `interface`.|

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
// Options: [{"tsConfigPath":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noUnusedExports/tsconfig.json"}]
export const FOO = '';

// Message: undefined
```

The following patterns are not considered problems:

```js
// Options: [{"tsConfigPath":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/noUnusedExports/tsconfig.json"}]
export const BAR = '';

```

</details>

<a name="user-content-eslint-plugin-canonical-rules-no-use-extend-native"></a>
<a name="eslint-plugin-canonical-rules-no-use-extend-native"></a>
### <code>no-use-extend-native</code>

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
Array.prototype.custom
// Message: undefined

Array.to
// Message: undefined

Array.to()
// Message: undefined

[].length()
// Message: undefined

'unicorn'.green
// Message: undefined

[].custom()
// Message: undefined

({}).custom()
// Message: undefined

/match_this/.custom()
// Message: undefined

'string'.custom()
// Message: undefined

console.log('foo'.custom)
// Message: undefined

console.log('foo'.custom())
// Message: undefined

('str' + 'ing').custom()
// Message: undefined

('str' + 'i' + 'ng').custom()
// Message: undefined

(1 + 'ing').custom()
// Message: undefined

(/regex/ + 'ing').custom()
// Message: undefined

(1 + 1).toLowerCase()
// Message: undefined

(1 + 1 + 1).toLowerCase()
// Message: undefined

(function testFunction() {}).custom()
// Message: undefined

new Array().custom()
// Message: undefined

new ArrayBuffer().custom()
// Message: undefined

new Boolean().custom()
// Message: undefined

new DataView().custom()
// Message: undefined

new Date().custom()
// Message: undefined

new Error().custom()
// Message: undefined

new Float32Array().custom()
// Message: undefined

new Float64Array().custom()
// Message: undefined

new Function().custom()
// Message: undefined

new Int16Array().custom()
// Message: undefined

new Int32Array().custom()
// Message: undefined

new Int8Array().custom()
// Message: undefined

new Map().custom()
// Message: undefined

new Number().custom()
// Message: undefined

new Object().custom()
// Message: undefined

new Promise().custom()
// Message: undefined

new RegExp().custom()
// Message: undefined

new Set().custom()
// Message: undefined

new String().custom()
// Message: undefined

new Symbol().custom()
// Message: undefined

new Uint16Array().custom()
// Message: undefined

new Uint32Array().custom()
// Message: undefined

new Uint8Array().custom()
// Message: undefined

new Uint8ClampedArray().custom()
// Message: undefined

new WeakMap().custom()
// Message: undefined

new WeakSet().custom()
// Message: undefined

new Array()['custom']
// Message: undefined

new Array()['custom']()
// Message: undefined
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

</details>


<a name="user-content-eslint-plugin-canonical-rules-prefer-import-alias"></a>
<a name="eslint-plugin-canonical-rules-prefer-import-alias"></a>
### <code>prefer-import-alias</code>

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

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
// Options: [{"aliases":[{"alias":"@/a/","matchPath":"^a\\/","maxRelativeDepth":-1}],"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { bar } from './bar';
// Message: undefined

// Options: [{"aliases":[{"alias":"@/a/","matchPath":"^a\\/","maxRelativeDepth":1}],"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { baz } from '../baz';
// Message: undefined

// Options: [{"aliases":[{"alias":"@/a/","matchPath":"^a\\/"}],"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { bar } from '../bar';
// Message: undefined
```

The following patterns are not considered problems:

```js
// Options: [{"aliases":[{"alias":"@/a/","matchParent":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias","matchPath":"^a\\/"}],"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { bar } from '../bar';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { foo } from '@bar/baz';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import Foo from '@bar/baz';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import Foo, { Foo } from 'bar';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { foo } from './foo';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { foo } from '../foo';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { foo } from '.././foo';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { foo } from '././../foo';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { foo } from '@bar/baz';

// Options: [{"baseDirectory":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/fixtures/preferImportAlias"}]
import { foo } from '../../foo';
```

</details>


<a name="user-content-eslint-plugin-canonical-rules-prefer-inline-type-import"></a>
<a name="eslint-plugin-canonical-rules-prefer-inline-type-import"></a>
### <code>prefer-inline-type-import</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

TypeScript 4.5 introduced [type modifiers](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#type-modifiers-on-import-names) that allow to inline type imports as opposed to having dedicated `import type`. This allows to remove duplicate type imports. This rule enforces use of import type modifiers.

<details><summary>📖 Examples</summary>
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

</details>


<a name="user-content-eslint-plugin-canonical-rules-prefer-react-lazy"></a>
<a name="eslint-plugin-canonical-rules-prefer-react-lazy"></a>
### <code>prefer-react-lazy</code>

Requires that components that can be loaded lazily be imported using the `React.lazy()` function.

```tsx
import { lazy } from 'react';
import { Foo } from './Foo';

export default () => {
  return Math.random() > 0.5 ? <Foo /> : null;
};
```

This rule converts the above code to:

```tsx
import { lazy } from 'react';

const Foo = lazy(() => import('./Foo.js').then(({ Foo }) => ({ default: Foo })));

export default () => {
  return Math.random() > 0.5 ? <Foo /> : null;
};
```

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
import React from 'react';
import { Foo } from './Foo';

export default () => {
  return <>
    {Math.random() > 0.5 ? <Foo /> : null}
  </>;
};
// Message: undefined

import React from 'react';
import { Foo } from './Foo';

export default () => {
  return <>
    {Math.random() > 0.5 ? <div>
      <Foo />
    </div> : null}
  </>;
};
// Message: undefined

import React from 'react';
import { Foo } from './Foo';

export default () => {
  return Math.random() > 0.5 ? <Foo /> : null;
};
// Message: undefined
```

The following patterns are not considered problems:

```js
import React, { lazy } from 'react';

const Foo = lazy(() => import('./Foo').then(({ Foo }) => ({ default: Foo })));

export default () => {
  return Math.random() > 0.5 ? <Foo /> : null;
};
```

</details>

<a name="user-content-eslint-plugin-canonical-rules-prefer-use-mount"></a>
<a name="eslint-plugin-canonical-rules-prefer-use-mount"></a>
### <code>prefer-use-mount</code>

In React, it is common to use [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) without dependencies when the intent is to run the effect only once (on mount and unmount). However, just doing that may lead to undesired side-effects, such as the effect being called twice in [Strict Mode](https://reactjs.org/docs/strict-mode.html). For this reason, it is better to use an abstraction such as [`useMount`](https://stackoverflow.com/a/72319081/368691) that handles this use case.

<details><summary>📖 Examples</summary>
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

</details>


<a name="user-content-eslint-plugin-canonical-rules-require-extension"></a>
<a name="eslint-plugin-canonical-rules-require-extension"></a>
### <code>require-extension</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Adds `.js` extension to all imports and exports.

It resolves the following cases:

<a name="user-content-eslint-plugin-canonical-rules-require-extension-relative-imports"></a>
<a name="eslint-plugin-canonical-rules-require-extension-relative-imports"></a>
#### Relative imports

Relative imports that resolve to a file of the same name:

```js
import './foo'; // => import './foo.js';
```

Relative imports that resolve to an index file:

```js
import './foo'; // => import './foo/index.js';
```

The above examples would also work if the file extension was `.ts` or `.tsx`, i.e.

```js
import './foo'; // => import './foo.ts';
import './foo'; // => import './foo/index.tsx';
```

<a name="user-content-eslint-plugin-canonical-rules-require-extension-typescript-paths"></a>
<a name="eslint-plugin-canonical-rules-require-extension-typescript-paths"></a>
#### TypeScript paths

For this to work, you have to [configure `import/resolver`](https://www.npmjs.com/package/eslint-import-resolver-typescript):

```ts
settings: {
  'import/resolver': {
    typescript: {
      project: path.resolve(__dirname, 'tsconfig.json'),
    },
  },
},
```

Imports that resolve to a file of the same name:

```js
import { foo } from '@/foo'; // => import { foo } from '@/foo.js';
```

Imports that resolve to an index file:

```js
import { foo } from '@/foo'; // => import { foo } from '@/foo/index.js';
```

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/pathsImport/tsconfig.json"}}}
import { foo } from '@/foo';

// Message: undefined

// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/pathsImportWithIndex/tsconfig.json"}}}
import { foo } from '@/foo';

// Message: undefined

// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/pathsImportWithIndex/tsconfig.json"}}}
import { foo } from '@/foo';

// Message: undefined

// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/relativeImport/tsconfig.json"}}}
import { foo } from './foo';

// Message: undefined

// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/relativeImportWithIndex/tsconfig.json"}}}
import { foo } from './foo';

// Message: undefined

// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/relativeNamedExport/tsconfig.json"}}}
export { foo } from './foo';

// Message: undefined

// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/exportAllDeclaration/tsconfig.json"}}}
export * from './foo';

// Message: undefined
```

The following patterns are not considered problems:

```js
// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/pathsImportIgnoreSearchParams/tsconfig.json"}}}
// @ts-expect-error ignore search params
import { foo } from './foo.svg?url';


// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/pathsImportIgnoreUnknownExtensions/tsconfig.json"}}}
import { foo } from '@/foo.css';


// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/pathsImportWithExtension/tsconfig.json"}}}
import { foo } from '@/foo.js';


// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/relativeImportIgnoreUnknownExtensions/tsconfig.json"}}}
import { foo } from './foo.css';


// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/relativeImportWithExtension/tsconfig.json"}}}
import { foo } from './foo.js';


// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/typedPackageImport/tsconfig.json"}}}
// Note that this resolves to roarr, which is a package with TypeScript types.
// Compare this test to the "packageTypesImport" test which imports dependency's types.
import { Roarr } from 'roarr';


// Settings: {"import/resolver":{"typescript":{"project":"/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/requireExtension/packageTypesImport/tsconfig.json"}}}
// Note that this resolves to @types/chance, which is a TypeScript declaration file.
// Compare this test to the "typedPackageImport" test which imports a typed dependency.
import { Chance } from 'chance';

```

</details>

<a name="user-content-eslint-plugin-canonical-rules-sort-destructure-keys"></a>
<a name="eslint-plugin-canonical-rules-sort-destructure-keys"></a>
### <code>sort-destructure-keys</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Requires that object destructuring properties are sorted alphabetically.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
const {b, a} = foo
// Message: undefined

// Options: [{"caseSensitive":true}]
const {a, B} = foo
// Message: undefined
```

The following patterns are not considered problems:

```js
const {a, b} = foo
```

</details>

<a name="user-content-eslint-plugin-canonical-rules-sort-keys"></a>
<a name="eslint-plugin-canonical-rules-sort-keys"></a>
### <code>sort-keys</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Note: This rule is equivalent to [`sort-keys`](https://eslint.org/docs/rules/sort-keys), except that it is fixable.

This rule requires identifiers in assignments and `function` definitions to match a specified regular expression.

<a name="user-content-eslint-plugin-canonical-rules-sort-keys-options-3"></a>
<a name="eslint-plugin-canonical-rules-sort-keys-options-3"></a>
#### Options

The 1st option is "asc" or "desc".

* "asc" (default) - enforce properties to be in ascending order.
* "desc" - enforce properties to be in descending order.

The 2nd option is an object which has 3 properties.

* `caseSensitive` - if true, enforce properties to be in case-sensitive order. Default is true.
* `minKeys` - Specifies the minimum number of keys that an object should have in order for the object's unsorted keys to produce an error. Default is 2, which means by default all objects with unsorted keys will result in lint errors.
* `natural` - if true, enforce properties to be in natural order. Default is false. Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically. So the number 10 comes after the number 3 in Natural Sorting.

<details><summary>📖 Examples</summary>
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

var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, À:3, 'Z':2, è:4}
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
var obj = {'#':1, 'Z':2, À:3, è:4}

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
var obj = {'#':1, 'Z':2, À:3, è:4}

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
var obj = {'#':1, 'Z':2, À:3, è:4}

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
var obj = {'#':1, 'Z':2, À:3, è:4}

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
var obj = {'#':1, 'Z':2, À:3, è:4}

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
var obj = {è:4, À:3, 'Z':2, '#':1}

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
var obj = {è:4, À:3, 'Z':2, '#':1}

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
var obj = {è:4, À:3, 'Z':2, '#':1}

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
var obj = {è:4, À:3, 'Z':2, '#':1}
```

</details>


<a name="user-content-eslint-plugin-canonical-rules-sort-react-dependencies"></a>
<a name="eslint-plugin-canonical-rules-sort-react-dependencies"></a>
### <code>sort-react-dependencies</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Requires that dependencies of React methods (`useEffect`, `useCallback` and `useMemo`) are sorted alphabetically.

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
useEffect(() => {}, [b, a])
// Message: undefined

// Options: [{"caseSensitive":true}]
useEffect(() => {}, [a, B])
// Message: undefined
```

The following patterns are not considered problems:

```js
useEffect(() => {}, [a, b])
```

</details>

<a name="user-content-eslint-plugin-canonical-rules-virtual-module"></a>
<a name="eslint-plugin-canonical-rules-virtual-module"></a>
### <code>virtual-module</code>

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Enforces "virtual modules" architecture.

Virtual modules is a convention-driven code architecture enforced using ESLint rules. In the most simple of terms, a virtual module is any directory that has a barrel file (`index.ts`). `index.ts` is the only way that a virtual module can be imported; any files contained inside of the same directory cannot be imported from outside of the virtual module, unless they are explicitly re-exported through `index.ts`.

Using the virtual module pattern:

* You separate the module public interface from their implementation details.
* You ensure that there is only 1 way to import every module across the project.
* You ensure that there are no cycling dependencies within the project.

<a name="user-content-eslint-plugin-canonical-rules-virtual-module-virtual-modules-architecture"></a>
<a name="eslint-plugin-canonical-rules-virtual-module-virtual-modules-architecture"></a>
#### Virtual Modules Architecture

The basic idea behind a virtual module is that every directory in your project that has `index.ts` becomes a "virtual module". That virtual module (and sub-folders) can only be imported through `index.ts`, i.e. `index.ts` needs to explicitly export everything that is part of the public interface. This pattern ensures that there is only one way to import all modules across the entire project, and that virtual module implementation details are not public unless they are explicitly re-exported through `index.ts`.

It is easiest to illustrate this using an example:

```
components/
├── Foo/
│   ├── Baz/
│   │   └── index.ts
│   └── Qux/
│       └── index.ts/
│           └── Quux/
│               └── index.ts
└── Bar/
    └── index.ts
```

In this example, `Bar`, `Baz`, `Qux` and `Quux` are all virtual modules.

* `Bar` can import from `Baz` and vice-versa.
* `Bar` can import from `Qux` and vice-versa.
* `Baz` can import from `Qux` and vice-versa.
* `Bar` cannot import directly from `Quux` because it is a sub-module of `Qux`. Only `Qux` can import from `Quux`.
* `Foo` does not have `index.ts`, therefore it is not a virtual module.

```
components/
├── Foo/
│   ├── index.ts
│   └── utilities.ts
└── Bar/
    └── index.ts
```

In this example, `Foo` and `Bar` are virtual modules.

* `Foo` can import from `Bar` and vice-versa.

However, unless `/components/Foo/index.ts` explicitly exports from `./utilities.ts`, then `Bar` cannot access `Foo` utilities, i.e. `./utilities.ts` is an implementation detail of `Foo` not meant for consumption by the rest of the application.

Other notes:

* Within a virtual module, only absolute imports can be used to import outside modules.
* Within a virtual module, only relative imports can be used to import module files (allows to relocate virtual module without impacting internal imports).
* A virtual module cannot import `index.ts` of itself (prevents circular references).
* A virtual module cannot access parent module (prevents circular references).

<details><summary>📖 Examples</summary>
The following patterns are considered problems:

```js
import { Bar } from '@/Bar'
// Message: undefined

export { Bar } from '@/Bar'
// Message: undefined

export * from '@/Bar'
// Message: undefined

import { Baz } from '@/Bar/Baz'
// Message: undefined

// Options: [{"includeModules":["/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/virtualModule/Bar/index.ts","/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/virtualModule/Bar/Baz/index.ts","/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/virtualModule/Foo/index.ts"]}]
import { Baz } from '@/Bar/Baz'
// Message: undefined

import { barUtility } from '@/Bar/utilities'
// Message: undefined

import { Baz } from './index'
// Message: undefined
```

The following patterns are not considered problems:

```js
import { Bar } from '@/Bar'

import { barUtility } from './utilities'

import { barRoutine } from './routines'

import { ESLint } from 'eslint'

// Options: [{"includeModules":["/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/virtualModule/Bar/Baz/index.ts","/Users/gajus/Developer/gajus/eslint-plugin-canonical/tests/fixtures/virtualModule/Foo/index.ts"]}]
import { Baz } from '@/Bar/Baz'
```

</details>


<a name="user-content-eslint-plugin-canonical-faq"></a>
<a name="eslint-plugin-canonical-faq"></a>
## FAQ

<a name="user-content-eslint-plugin-canonical-faq-why-is-the-typescript-eslint-parser"></a>
<a name="eslint-plugin-canonical-faq-why-is-the-typescript-eslint-parser"></a>
### Why is the <code>@typescript-eslint/parser</code>?

This ESLint plugin is written using `@typescript-eslint/utils`, which assume that `@typescript-eslint/parser` is used.

Some rules may work without `@typescript-eslint/parser`. However, rules are implemented and tested assuming that `@typescript-eslint/parser` is used.