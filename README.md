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
        * [`id-match`](#eslint-plugin-canonical-rules-id-match)
        * [`no-restricted-strings`](#eslint-plugin-canonical-rules-no-restricted-strings)
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



