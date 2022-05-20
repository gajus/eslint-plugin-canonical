const create = (context) => {
  return {
    CallExpression (node) {
      if (node.callee.name !== 'useEffect') {
        return;
      }

      const dependenciesArgument = node.arguments[1];

      if (!dependenciesArgument) {
        return;
      }

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
};

export default {
  create,
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
};
