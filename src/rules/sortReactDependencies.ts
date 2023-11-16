/**
 * @author https://github.com/mthadley/eslint-plugin-sort-destructure-keys/blob/master/tests/lib/rules/sort-destructure-keys.js
 */

import { createRule } from '../utilities';
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/types';
import naturalCompare from 'natural-compare';

const defaultOptions = {
  caseSensitive: true,
};

type Options = [
  {
    caseSensitive?: boolean;
  },
];

const messages = {
  sort: 'Dependencies should be sorted alphabetically.',
};

export default createRule<Options, keyof typeof messages>({
  create: (context, [options]) => {
    const { caseSensitive = true } = options;

    return {
      CallExpression(node) {
        const isTargetedHook =
          node.callee.type === 'Identifier' &&
          ['useEffect', 'useCallback', 'useMemo'].includes(node.callee.name);

        if (!isTargetedHook) {
          return;
        }

        const lastArgument = node.arguments[node.arguments.length - 1];

        if (lastArgument.type !== 'ArrayExpression') {
          return;
        }

        const elements = lastArgument.elements as TSESTree.Identifier[];

        if (
          !elements.every((element) => {
            return element?.type === AST_NODE_TYPES.Identifier;
          })
        ) {
          return;
        }

        // eslint-disable-next-line unicorn/consistent-function-scoping
        const sorter = (a: string, b: string) => {
          const result = naturalCompare(a, b);
          return caseSensitive ? result : result * -1;
        };

        const sortedElements = [...elements].sort((a, b) =>
          sorter(a.name, b.name),
        );

        for (const [index, element] of elements.entries()) {
          if (element?.name !== sortedElements[index]?.name) {
            context.report({
              fix(fixer) {
                const sortedCode = sortedElements
                  .map((sortedElement) => sortedElement.name)
                  .join(', ');
                return fixer.replaceText(lastArgument, `[${sortedCode}]`);
              },
              messageId: 'sort',
              node: lastArgument,
            });
            break;
          }
        }
      },
    };
  },
  defaultOptions: [defaultOptions],
  meta: {
    docs: {
      description:
        'Requires that dependencies of React methods are sorted alphabetically.',
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
    type: 'suggestion',
  },
  name: 'sort-react-dependencies',
});
