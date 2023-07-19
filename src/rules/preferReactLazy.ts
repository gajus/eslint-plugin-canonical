import { createRule } from '../utilities';

type Options = [];

type MessageIds = 'preferReactLazy';

export default createRule<Options, MessageIds>({
  create: (context) => {
    const imported: string[] = [];

    return {
      ConditionalExpression(node) {
        if (node.consequent.type === 'JSXElement') {
          // @ts-expect-error TODO
          const name = node.consequent.openingElement.name.name;

          if (imported.includes(name)) {
            context.report({
              messageId: 'preferReactLazy',
              node,
            });
          }
        }
      },
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') {
            continue;
          }

          imported.push(specifier.imported.name);
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'require that useMount(() => {}) is used instead of useEffect(() => {}, [])',
      recommended: 'recommended',
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
