export default {
  create: (context) => {
    return {
      ExportNamedDeclaration: (node) => {
        const sourceCode = context.getSourceCode();
        for (let index = 1; index < node.specifiers.length; index++) {
          const lastTokenOfPreviousProperty = sourceCode.getLastToken(node.specifiers[index - 1]);
          const firstTokenOfCurrentProperty = sourceCode.getFirstToken(node.specifiers[index]);

          if (lastTokenOfPreviousProperty.loc.end.line === firstTokenOfCurrentProperty.loc.start.line) {
            context.report({
              fix (fixer) {
                const comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty);
                const rangeAfterComma = [
                  comma.range[1],
                  firstTokenOfCurrentProperty.range[0],
                ];

                // Don't perform a fix if there are any comments between the comma and the next property.
                if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim()) {
                  return null;
                }

                return fixer.replaceTextRange(rangeAfterComma, '\n');
              },
              loc: firstTokenOfCurrentProperty.loc,
              messageId: 'specifiersOnNewline',
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
      specifiersOnNewline: 'Export specifiers must go on a new line.',
    },
    schema: [],
    type: 'layout',
  },
};
