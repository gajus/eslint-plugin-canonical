/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable func-style */

/**
 * @file Rule to require object keys to be sorted
 * @author Toru Nagashima
 */
import { type RuleFix } from '@typescript-eslint/utils/dist/ts-eslint';
import naturalCompare from 'natural-compare';
import { createRule } from '../utilities';

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
  let property;

  switch (node.type) {
    case 'Property':
    case 'MethodDefinition':
      property = node.key;
      break;

    case 'MemberExpression':
      property = node.property;
      break;

    // no default
  }

  switch (property.type) {
    case 'Literal':
      return String(property.value);

    case 'TemplateLiteral':
      if (property.expressions.length === 0 && property.quasis.length === 1) {
        return property.quasis[0].value.cooked;
      }

      break;

    case 'Identifier':
      if (!node.computed) {
        return property.name;
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
function getPropertyName(node) {
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
 * Postfix `N` is meant natural.
 *
 * @private
 */
const isValidOrders = {
  asc(a, b) {
    return a <= b;
  },
  ascI(a, b) {
    return a.toLowerCase() <= b.toLowerCase();
  },
  ascIN(a, b) {
    return naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0;
  },
  ascN(a, b) {
    return naturalCompare(a, b) <= 0;
  },
  desc(a, b) {
    return isValidOrders.asc(b, a);
  },
  descI(a, b) {
    return isValidOrders.ascI(b, a);
  },
  descIN(a, b) {
    return isValidOrders.ascIN(b, a);
  },
  descN(a, b) {
    return isValidOrders.ascN(b, a);
  },
};

type Stack = {
  prevName: string | null;
  prevNode: unknown;
  upper: Stack | null;
};

const defaultOptions = {
  caseSensitive: true,
  minKeys: 2,
  natural: false,
};

export default createRule({
  create(context) {
    // Parse options.
    const order = context.options[0] || 'asc';
    const options = context.options[1] ?? defaultOptions;

    if (typeof options === 'string') {
      throw new TypeError('Unexpected state');
    }

    const insensitive = options.caseSensitive === false;
    const natural = Boolean(options.natural);
    const isValidOrder =
      isValidOrders[order + (insensitive ? 'I' : '') + (natural ? 'N' : '')];

    // The stack to save the previous property's name for each object literals.
    let stack: Stack | null = null;

    const SpreadElement = (node) => {
      if (node.parent.type === 'ObjectExpression') {
        if (!stack) {
          throw new Error('Unexpected state');
        }

        stack.prevName = null;
      }
    };

    return {
      ExperimentalSpreadProperty: SpreadElement,

      ObjectExpression() {
        stack = {
          prevName: null,
          prevNode: null,
          upper: stack,
        };
      },

      'ObjectExpression:exit'() {
        if (!stack) {
          throw new Error('Unexpected state');
        }

        stack = stack.upper;
      },

      Property(node) {
        if (node.parent?.type === 'ObjectPattern') {
          return;
        }

        if (!stack) {
          throw new Error('Unexpected state');
        }

        const { prevName } = stack;

        const { prevNode } = stack;
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
              natural: natural ? 'natural ' : '',
              order,
              prevName,
              thisName,
            },
            fix(fixer) {
              const fixes: RuleFix[] = [];
              const sourceCode = context.getSourceCode();
              const moveProperty = (fromNode, toNode) => {
                const previousText = sourceCode.getText(fromNode);
                const thisComments = sourceCode.getCommentsBefore(fromNode);
                for (const thisComment of thisComments) {
                  fixes.push(
                    fixer.insertTextBefore(
                      toNode,
                      sourceCode.getText(thisComment) + '\n',
                    ),
                  );
                  fixes.push(fixer.remove(thisComment));
                }

                fixes.push(fixer.replaceText(toNode, previousText));
              };

              moveProperty(node, prevNode);
              moveProperty(prevNode, node);

              return fixes;
            },
            loc: node.key.loc,
            messageId: 'sort',
            node,
          });
        }
      },

      SpreadElement,
    };
  },
  defaultOptions: ['asc', defaultOptions],
  meta: {
    docs: {
      description: 'require object keys to be sorted',
      recommended: 'error',
    },
    fixable: 'code',
    messages: {
      sort: "Expected object keys to be in {{natural}}{{insensitive}}{{order}}ending order. '{{thisName}}' should be before '{{prevName}}'.",
    },
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
  name: 'sort-keys',
});
