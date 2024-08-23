import { type TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utilities';

type Options = [];

type MessageIds = 'preferReactLazy';

const findConditionalExpressionParent = (node: TSESTree.JSXOpeningElement) => {
  let currentNode: TSESTree.Node = node;

  while (currentNode.parent) {
    currentNode = currentNode.parent;

    if (currentNode.type === 'ConditionalExpression') {
      return true;
    }
  }

  return false;
};

export default createRule<Options, MessageIds>({
  create: (context) => {
    const imported: string[] = [];

    return {
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') {
            continue;
          }

          imported.push(specifier.imported.name);
        }
      },
      JSXOpeningElement(node) {
        // @ts-expect-error TODO
        const name = node.name.name;

        if (!findConditionalExpressionParent(node)) {
          return;
        }

        if (imported.includes(name)) {
          context.report({
            messageId: 'preferReactLazy',
            node,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'require that useMount(() => {}) is used instead of useEffect(() => {}, [])',
    },
    messages: {
      preferReactLazy:
        'Use React.lazy() to load conditionally rendered components.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'prefer-use-mount',
});
