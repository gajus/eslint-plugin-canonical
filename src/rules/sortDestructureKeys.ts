/**
 * @author https://github.com/mthadley/eslint-plugin-sort-destructure-keys/blob/master/tests/lib/rules/sort-destructure-keys.js
 */

import { type TSESTree } from '@typescript-eslint/types';
import naturalCompare from 'natural-compare';
import { createRule } from '../utilities';

/**
 * Get's the "name" of the node, which could be an Identifier,
 * StringLiteral, or NumberLiteral, etc.
 *
 * This returned string is used to sort nodes of the same type.
 */
const getNodeName = (node): string => {
  switch (node.type) {
    case 'Property':
      return getNodeName(node.key);
    case 'Identifier':
      return node.name;
    case 'Literal':
      return node.value.toString();
    case 'RestElement':
    case 'RestProperty':
      return node.argument.name;
    default:
      return node.type;
  }
};

/**
 * Sort priority for node types.
 */
const NODE_TYPE_SORT_ORDER = {
  ComputedProperty: 2,

  ExperimentalRestProperty: 99,

  /* Property keys */
  Identifier: 1,

  Literal: 1,

  /* ObjectPattern children */
  Property: 1,
  RestElement: 99,
  RestProperty: 99,
  TemplateLiteral: 2,
};

const SORT_ORDER_DEFAULT = 98;

/**
 * Returns true if the node is a "real", computed property. We don't consider
 * computed properties with a literal value to be a "real" computed property. This
 * is useful since that means they can be sorted.
 */
const isComputedProperty = (node) => {
  return node.computed && node.key.type !== 'Literal';
};

const getSortOrder = (node) => {
  return isComputedProperty(node)
    ? NODE_TYPE_SORT_ORDER.ComputedProperty
    : NODE_TYPE_SORT_ORDER[node.type] || SORT_ORDER_DEFAULT;
};

/**
 * Returns true if any references to this ID are within the objectPatternNode
 */
const isReferencedByOtherProperties = (scope, objectPatternNode, id) => {
  for (const variable of scope.variables) {
    if (variable.name !== id.name) {
      continue;
    }

    for (const reference of variable.references) {
      if (reference.identifier === id) {
        continue;
      }

      let current = reference.identifier;
      while (current) {
        if (current === objectPatternNode) {
          return true;
        }

        current = current.parent;
      }
    }

    return false;
  }
};

/**
 * Returns whether or not a node is safe to be sorted.
 */
const shouldCheck = (scope, objectPatternNode, node) => {
  if (node.type !== 'Property') {
    return true;
  }

  switch (node.value.type) {
    case 'ObjectPattern':
      return node.value.properties.every((propertyNode) =>
        shouldCheck(scope, objectPatternNode, propertyNode),
      );
    case 'ArrayPattern':
      // Fake the element as a property for simplicity
      return node.value.elements.every(
        (element) =>
          !element ||
          shouldCheck(scope, objectPatternNode, {
            type: 'Property',
            value: element,
          }),
      );
    case 'AssignmentPattern':
      if (node.value.left.type === 'Identifier') {
        return !isReferencedByOtherProperties(
          scope,
          objectPatternNode,
          node.value.left,
        );
      }

      return true;
    case 'Identifier':
      return !isReferencedByOtherProperties(
        scope,
        objectPatternNode,
        node.value,
      );
    default:
      return true;
  }
};

/**
 * Returns a function that will sort two nodes found in an `ObjectPattern`.
 *
 * TODO: Maybe it makes sense to do a topological sort here based on identifiers?
 * Ideally we wouldn't need to arbitrarily skip sorting nodes because we are worried
 * about breaking the code.
 */
const createSorter = (caseSensitive) => {
  const sortName = (a) => (caseSensitive ? a : a.toLowerCase());

  return (a, b) => {
    // When we have different node "types"
    const nodeResult = getSortOrder(a) - getSortOrder(b);
    if (nodeResult !== 0) return nodeResult;

    // When the keys have different "types"
    const keyResult = getSortOrder(a.key) - getSortOrder(b.key);
    if (keyResult !== 0) return keyResult;

    return naturalCompare(sortName(getNodeName(a)), sortName(getNodeName(b)));
  };
};

/**
 * Creates a "fixer" function to be used by `--fix`.
 */
const createFix = ({ context, fixer, node, sorter }) => {
  const sourceCode = context.getSourceCode();
  const sourceText = sourceCode.getText();

  const sorted = node.properties.concat().sort(sorter);

  const newText = sorted
    .map((child, index) => {
      const textAfter =
        index === sorted.length - 1
          ? // If it's the last item, there's no text after to append.
            ''
          : // Otherwise, we need to grab the text after the original node.
            sourceText.slice(
              node.properties[index].range[1], // End index of the current node .
              node.properties[index + 1].range[0], // Start index of the next node.
            );

      return sourceCode.getText(child) + textAfter;
    })
    .join('');

  return fixer.replaceTextRange(
    [
      node.properties[0].range[0], // Start index of the first node.
      node.properties[node.properties.length - 1].range[1], // End index of the last node.
    ],
    newText,
  );
};

const defaultOptions = {
  caseSensitive: true,
};

type Options = [
  {
    caseSensitive?: boolean;
  },
];

const messages = {
  sort: 'Expected object keys to be in sorted order. Expected {{first}} to be before {{second}}.',
};

export default createRule<Options, keyof typeof messages>({
  create: (context, [options]) => {
    const { caseSensitive = true } = options;
    const sorter = createSorter(caseSensitive);

    return {
      ObjectPattern(objectPatternNode) {
        const scope = context.getScope();

        /*
         * If the node is more complex than just basic destructuring
         * with literal defaults, we just skip it. If some values use
         * previous values as defaults, then we cannot simply sort them.
         */
        if (
          !objectPatternNode.properties.every((node) =>
            shouldCheck(scope, objectPatternNode, node),
          )
        ) {
          return;
        }

        let previousNode: TSESTree.Property | TSESTree.RestElement | null =
          null;

        for (const nextNode of objectPatternNode.properties) {
          if (previousNode && sorter(previousNode, nextNode) > 0) {
            context.report({
              data: {
                first: getNodeName(nextNode),
                second: getNodeName(previousNode),
              },
              fix: (fixer) =>
                createFix({
                  context,
                  fixer,
                  node: objectPatternNode,
                  sorter,
                }),
              messageId: 'sort',
              node: nextNode,
            });

            break;
          }

          previousNode = nextNode;
        }
      },
    };
  },
  defaultOptions: [defaultOptions],
  meta: {
    docs: {
      description:
        'Requires that object destructuring properties are sorted alphabetically.',
      recommended: 'recommended',
    },
    fixable: 'code',
    messages,
    schema: [
      {
        additionalProperties: false,
        properties: {
          caseSensitive: {
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'layout',
  },
  name: 'sort-destructure-keys',
});
