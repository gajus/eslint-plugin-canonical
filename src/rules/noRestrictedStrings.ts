import {
  createRule,
} from '../utilities';

export default createRule({
  create: (context) => {
    const {
      options,
    } = context;

    const disallowedStrings = options[0] ?? [];

    return {
      Literal: (node) => {
        if (
          node.value !== '' &&
          typeof node.value === 'string' &&
          /\S/u.test(node.value)
        ) {
          for (const disallowedString of disallowedStrings) {
            if (node.value.includes(disallowedString)) {
              context.report({
                data: {
                  disallowedString,
                },
                messageId: 'disallowedString',
                node,
              });
            }
          }
        }
      },

      TemplateElement: (node) => {
        if (node.value.raw !== '') {
          for (const disallowedString of disallowedStrings) {
            if (node.value.raw.includes(disallowedString)) {
              context.report({
                data: {
                  disallowedString,
                },
                messageId: 'disallowedStringInTemplate',
                node,
              });
            }
          }
        }
      },
    };
  },
  defaultOptions: [
    [] as string[],
  ],
  meta: {
    docs: {
      description: 'Disallowed string.',
      recommended: false,
    },
    messages: {
      disallowedString: 'Disallowed string: \'{{disallowedString}}\'.',
      disallowedStringInTemplate: 'Disallowed string in template: \'{{disallowedString}}\'.',
    },
    schema: {
      items: {
        items: {
          type: 'string',
        },
        type: 'array',
      },
      type: 'array',
    },
    type: 'problem',
  },
  name: 'no-restricted-strings',
});
