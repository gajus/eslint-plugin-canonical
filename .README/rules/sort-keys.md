### `sort-keys`

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Note: This rule is equivalent to [`sort-keys`](https://eslint.org/docs/rules/sort-keys), except that it is fixable.

This rule requires identifiers in assignments and `function` definitions to match a specified regular expression.

#### Options

The 1st option is "asc" or "desc".

* "asc" (default) - enforce properties to be in ascending order.
* "desc" - enforce properties to be in descending order.

The 2nd option is an object which has 3 properties.

* `caseSensitive` - if true, enforce properties to be in case-sensitive order. Default is true.
* `minKeys` - Specifies the minimum number of keys that an object should have in order for the object's unsorted keys to produce an error. Default is 2, which means by default all objects with unsorted keys will result in lint errors.
* `natural` - if true, enforce properties to be in natural order. Default is false. Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically. So the number 10 comes after the number 3 in Natural Sorting.

<!-- assertions sortKeys -->
