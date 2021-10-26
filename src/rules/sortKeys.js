/* eslint-disable func-style */

/**
 * @file Rule to require object keys to be sorted
 * @author Toru Nagashima
 */

import naturalCompare from 'natural-compare';

/**
  * Gets the property name of a given node.
  * The node can be a MemberExpression, a Property, or a MethodDefinition.
  *
  * If the name is dynamic, this returns `null`.
  *
  * For examples:
  *
  *     a.b           // => "b"
  *     a["b"]        // => "b"
  *     a['b']        // => "b"
  *     a[`b`]        // => "b"
  *     a[100]        // => "100"
  *     a[b]          // => null
  *     a["a" + "b"]  // => null
  *     a[tag`b`]     // => null
  *     a[`${b}`]     // => null
  *
  *     let a = {b: 1}            // => "b"
  *     let a = {["b"]: 1}        // => "b"
  *     let a = {['b']: 1}        // => "b"
  *     let a = {[`b`]: 1}        // => "b"
  *     let a = {[100]: 1}        // => "100"
  *     let a = {[b]: 1}          // => null
  *     let a = {["a" + "b"]: 1}  // => null
  *     let a = {[tag`b`]: 1}     // => null
  *     let a = {[`${b}`]: 1}     // => null
  *
  * @param {ASTNode} node - The node to get.
  * @returns {string|null} The property name if static. Otherwise, null.
  */
const getStaticPropertyName = (node) => {
  let prop;

  switch (node && node.type) {
  case 'Property':
  case 'MethodDefinition':
    prop = node.key;
    break;

  case 'MemberExpression':
    prop = node.property;
    break;

    // no default
  }

  switch (prop && prop.type) {
  case 'Literal':
    return String(prop.value);

  case 'TemplateLiteral':
    if (prop.expressions.length === 0 && prop.quasis.length === 1) {
      return prop.quasis[0].value.cooked;
    }

    break;

  case 'Identifier':
    if (!node.computed) {
      return prop.name;
    }

    break;

    // no default
  }

  return null;
};

/**
  * Gets the property name of the given `Property` node.
  *
  * - If the property's key is an `Identifier` node, this returns the key's name
  *   whether it's a computed property or not.
  * - If the property has a static name, this returns the static name.
  * - Otherwise, this returns null.
  *
  * @param {ASTNode} node - The `Property` node to get.
  * @returns {string|null} The property name or null.
  * @private
  */
function getPropertyName (node) {
  const staticName = getStaticPropertyName(node);

  if (staticName !== null) {
    return staticName;
  }

  return node.key.name || null;
}

/**
  * Functions which check that the given 2 names are in specific order.
  *
  * Postfix `I` is meant insensitive.
  * Postfix `N` is meant natual.
  *
  * @private
  */
const isValidOrders = {
  asc (a, b) {
    return a <= b;
  },
  ascI (a, b) {
    return a.toLowerCase() <= b.toLowerCase();
  },
  ascIN (a, b) {
    return naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0;
  },
  ascN (a, b) {
    return naturalCompare(a, b) <= 0;
  },
  desc (a, b) {
    return isValidOrders.asc(b, a);
  },
  descI (a, b) {
    return isValidOrders.ascI(b, a);
  },
  descIN (a, b) {
    return isValidOrders.ascIN(b, a);
  },
  descN (a, b) {
    return isValidOrders.ascN(b, a);
  },
};

export default {
  create (context) {
    // Parse options.
    const order = context.options[0] || 'asc';
    const options = context.options[1];
    const insensitive = (options && options.caseSensitive) === false;
    const natual = Boolean(options && options.natural);
    const isValidOrder = isValidOrders[order + (insensitive ? 'I' : '') + (natual ? 'N' : '')];

    // The stack to save the previous property's name for each object literals.
    let stack = null;

    const SpreadElement = (node) => {
      if (node.parent.type === 'ObjectExpression') {
        stack.prevName = null;
      }
    };

    return {
      ExperimentalSpreadProperty: SpreadElement,

      ObjectExpression () {
        stack = {
          prevName: null,
          prevNode: null,
          upper: stack,
        };
      },

      'ObjectExpression:exit' () {
        stack = stack.upper;
      },

      Property (node) {
        if (node.parent.type === 'ObjectPattern') {
          return;
        }

        const {prevName} = stack;
        const {prevNode} = stack;
        const thisName = getPropertyName(node);

        if (thisName !== null) {
          stack.prevName = thisName;
          stack.prevNode = node || prevNode;
        }

        if (prevName === null || thisName === null) {
          return;
        }

        if (!isValidOrder(prevName, thisName)) {
          context.report({
            data: {
              insensitive: insensitive ? 'insensitive ' : '',
              natual: natual ? 'natural ' : '',
              order,
              prevName,
              thisName,
            },
            fix (fixer) {
              const fixes = [];
              const sourceCode = context.getSourceCode();
              const moveProperty = (fromNode, toNode) => {
                const prevText = sourceCode.getText(fromNode);
                const thisComments = sourceCode.getCommentsBefore(fromNode);
                for (const thisComment of thisComments) {
                  fixes.push(fixer.insertTextBefore(toNode, sourceCode.getText(thisComment) + '\n'));
                  fixes.push(fixer.remove(thisComment));
                }

                fixes.push(fixer.replaceText(toNode, prevText));
              };

              moveProperty(node, prevNode);
              moveProperty(prevNode, node);

              return fixes;
            },
            loc: node.key.loc,
            message:
              'Expected object keys to be in {{natual}}{{insensitive}}{{order}}ending order. \'{{thisName}}\' should be before \'{{prevName}}\'.',
            node,
          });
        }
      },

      SpreadElement,
    };
  },

  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'require object keys to be sorted',
      recommended: false,
      url: 'https://github.com/leo-buneev/eslint-plugin-sort-keys-fix',
    },
    fixable: 'code',
    schema: [
      {
        enum: ['asc', 'desc'],
      },
      {
        additionalProperties: false,
        properties: {
          caseSensitive: {
            type: 'boolean',
          },
          natural: {
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
};
