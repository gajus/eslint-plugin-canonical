export default {
  create (context) {
    const allowSameLine = context.options[0] && context.options[0].allowAllPropertiesOnSameLine;
    const messageId = allowSameLine ?
      'propertiesOnNewlineAll' :
      'propertiesOnNewline';

    const sourceCode = context.getSourceCode();

    return {
      ObjectPattern (node) {
        if (allowSameLine && node.properties.length > 1) {
          const firstTokenOfFirstProperty = sourceCode.getFirstToken(node.properties[0]);
          const lastTokenOfLastProperty = sourceCode.getLastToken(node.properties[node.properties.length - 1]);

          if (firstTokenOfFirstProperty.loc.end.line === lastTokenOfLastProperty.loc.start.line) {
            // All keys and values are on the same line
            return;
          }
        }

        for (let index = 1; index < node.properties.length; index++) {
          const lastTokenOfPreviousProperty = sourceCode.getLastToken(node.properties[index - 1]);
          const firstTokenOfCurrentProperty = sourceCode.getFirstToken(node.properties[index]);

          if (lastTokenOfPreviousProperty.loc.end.line === firstTokenOfCurrentProperty.loc.start.line) {
            context.report({
              fix (fixer) {
                const comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty);
                const rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]];

                // Don't perform a fix if there are any comments between the comma and the next property.
                if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim()) {
                  return null;
                }

                return fixer.replaceTextRange(rangeAfterComma, '\n');
              },
              loc: firstTokenOfCurrentProperty.loc,
              messageId,
              node,
            });
          }
        }
      },
    };
  },
  meta: {
    fixable: 'whitespace',
    messages: {
      propertiesOnNewline: 'Destructuring properties must go on a new line.',
      propertiesOnNewlineAll: 'Destructuring properties must go on a new line if they aren\'t all on the same line.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowAllPropertiesOnSameLine: {
            default: false,
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'layout',
  },
};
