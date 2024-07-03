import { createRule } from '../utilities';

type Options = [
  {
    allowAllPropertiesOnSameLine: boolean;
  },
];

type MessageIds = 'propertiesOnNewline' | 'propertiesOnNewlineAll';

export default createRule<Options, MessageIds>({
  create(context, [{ allowAllPropertiesOnSameLine }]) {
    const messageId = allowAllPropertiesOnSameLine
      ? 'propertiesOnNewlineAll'
      : 'propertiesOnNewline';

    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return {
      ArrayPattern: (node) => {
        if (allowAllPropertiesOnSameLine && node.elements.length > 1) {
          const firstToken = node.elements[0];
          const lastToken = node.elements[node.elements.length - 1];

          if (firstToken === null) {
            return;
          }

          if (lastToken === null) {
            return;
          }

          const firstTokenOfFirstProperty =
            sourceCode.getFirstToken(firstToken);

          const lastTokenOfLastProperty = sourceCode.getLastToken(lastToken);

          if (firstTokenOfFirstProperty === null) {
            return;
          }

          if (lastTokenOfLastProperty === null) {
            return;
          }

          if (
            firstTokenOfFirstProperty.loc.end.line ===
            lastTokenOfLastProperty.loc.start.line
          ) {
            // All keys and values are on the same line
            return;
          }
        }

        for (let index = 1; index < node.elements.length; index++) {
          const currentNode = node.elements[index];
          const previousNode = node.elements[index - 1];

          if (currentNode === null || previousNode === null) {
            continue;
          }

          const lastTokenOfPreviousProperty =
            sourceCode.getLastToken(previousNode);
          const firstTokenOfCurrentProperty =
            sourceCode.getFirstToken(currentNode);

          if (
            lastTokenOfPreviousProperty === null ||
            firstTokenOfCurrentProperty === null
          ) {
            continue;
          }

          if (
            lastTokenOfPreviousProperty.loc.end.line ===
            firstTokenOfCurrentProperty.loc.start.line
          ) {
            context.report({
              fix(fixer) {
                const comma = sourceCode.getTokenBefore(
                  firstTokenOfCurrentProperty,
                );

                if (comma === null) {
                  return null;
                }

                const rangeAfterComma: readonly [number, number] = [
                  comma.range[1],
                  firstTokenOfCurrentProperty.range[0],
                ];

                // Don't perform a fix if there are any comments between the comma and the next property.
                if (
                  sourceCode.text
                    .slice(rangeAfterComma[0], rangeAfterComma[1])
                    .trim()
                ) {
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
      ObjectPattern: (node) => {
        if (allowAllPropertiesOnSameLine && node.properties.length > 1) {
          const firstTokenOfFirstProperty = sourceCode.getFirstToken(
            node.properties[0],
          );
          const lastTokenOfLastProperty = sourceCode.getLastToken(
            node.properties[node.properties.length - 1],
          );

          if (
            firstTokenOfFirstProperty === null ||
            lastTokenOfLastProperty === null
          ) {
            return;
          }

          if (
            firstTokenOfFirstProperty.loc.end.line ===
            lastTokenOfLastProperty.loc.start.line
          ) {
            // All keys and values are on the same line
            return;
          }
        }

        for (let index = 1; index < node.properties.length; index++) {
          const lastTokenOfPreviousProperty = sourceCode.getLastToken(
            node.properties[index - 1],
          );
          const firstTokenOfCurrentProperty = sourceCode.getFirstToken(
            node.properties[index],
          );

          if (
            lastTokenOfPreviousProperty === null ||
            firstTokenOfCurrentProperty === null
          ) {
            return;
          }

          if (
            lastTokenOfPreviousProperty.loc.end.line ===
            firstTokenOfCurrentProperty.loc.start.line
          ) {
            context.report({
              fix(fixer) {
                const comma = sourceCode.getTokenBefore(
                  firstTokenOfCurrentProperty,
                );

                if (comma === null) {
                  return null;
                }

                const rangeAfterComma: readonly [number, number] = [
                  comma.range[1],
                  firstTokenOfCurrentProperty.range[0],
                ];

                // Don't perform a fix if there are any comments between the comma and the next property.
                if (
                  sourceCode.text
                    .slice(rangeAfterComma[0], rangeAfterComma[1])
                    .trim()
                ) {
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
  defaultOptions: [
    {
      allowAllPropertiesOnSameLine: false,
    },
  ],
  meta: {
    docs: {
      description: 'Like `object-property-newline`, but for destructuring.',
      recommended: 'recommended',
    },
    fixable: 'whitespace',
    messages: {
      propertiesOnNewline: 'Destructuring properties must go on a new line.',
      propertiesOnNewlineAll:
        "Destructuring properties must go on a new line if they aren't all on the same line.",
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
  name: 'destructuring-property-newline',
});
