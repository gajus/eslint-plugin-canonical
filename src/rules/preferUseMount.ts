import { createRule } from '../utilities';

export default createRule({
  create: (context) => {
    return {
      CallExpression(node) {
        // @ts-expect-error TODO
        if (node.callee.name !== 'useEffect') {
          return;
        }

        const dependenciesArgument = node.arguments[1];

        if (!dependenciesArgument) {
          return;
        }

        // @ts-expect-error TODO
        if (dependenciesArgument.elements.length > 0) {
          return;
        }

        context.report({
          loc: node.loc,
          messageId: 'noEffectWithoutDependencies',
          node,
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'require that useMount(() => {}) is used instead of useEffect(() => {}, [])',
      recommended: false,
    },
    messages: {
      noEffectWithoutDependencies:
        'Use useMount when the intent is to run effect only once.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'prefer-use-mount',
});
