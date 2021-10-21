export default {
  create: (context) => {
    const {options} = context;

    const disallowedStrings = options[0] || [];

    return {
      Literal: (node) => {
        if (
          node.value !== '' &&
          /\S/.test(node.value)
        ) {
          for (const disallowedString of disallowedStrings) {
            if (node.value.includes(disallowedString)) {
              context.report(node, `Disallowed string: '${disallowedString}'.`);
            }
          }
        }
      },

      TemplateElement: (node) => {
        if (node.value.raw !== '') {
          for (const disallowedString of disallowedStrings) {
            if (node.value.raw.includes(disallowedString)) {
              context.report(
                node,
                `Disallowed string in template: '${disallowedString}'.`,
              );
            }
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: '',
      description: 'Disallowed string.',
      recommended: false,
    },
    fixable: null,
    schema: {
      items: {
        items: {
          type: 'string',
        },
        type: 'array',
      },
      type: 'array',
    },
  },
};
