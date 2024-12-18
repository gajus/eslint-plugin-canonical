import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/types';
import { orderBy } from 'natural-orderby';
import { createRule } from '../utilities';

const defaultOptions = {
  order: 'asc',
} as const;

type Options = [
  {
    order?: 'asc' | 'desc';
  },
];

const messages = {
  sort: 'Dependencies should be sorted alphabetically.',
};

export default createRule<Options, keyof typeof messages>({
  create: (context, [options]) => {
    const { caseSensitive = true, order = 'asc' } = options;

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

        const sortedElements = orderBy(elements, [value => value.name], [order])

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
    },
    fixable: 'code',
    messages,
    schema: [
      {
        additionalProperties: false,
        properties: {
          order: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'asc',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'sort-react-dependencies',
});
