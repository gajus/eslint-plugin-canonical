import analyzeTsConfig from 'ts-unused-exports';
import { createRule } from '../utilities';

const defaultOptions = {
  tsConfigPath: '',
};

type Options = [
  {
    tsConfigPath: string;
  },
];

type MessageIds = 'unusedExport';

export default createRule<Options, MessageIds>({
  create: (context) => {
    const [options] = context.options;

    const result = analyzeTsConfig(options.tsConfigPath);

    return {
      Program() {
        const filename = context.getFilename();

        if (!result[filename]) {
          return;
        }

        const sourceCode = context.getSourceCode();

        for (const unusedExport of result[filename]) {
          const index = sourceCode.getIndexFromLoc({
            column: unusedExport.location.character,
            line: unusedExport.location.line,
          });

          const exportToken = sourceCode.getTokenByRangeStart(index);

          if (!exportToken) {
            throw new Error('Expected export node');
          }

          context.report({
            data: {
              exportName: unusedExport.exportName,
            },
            messageId: 'unusedExport',
            node: exportToken,
          });
        }
      },
    };
  },
  defaultOptions: [defaultOptions],
  meta: {
    docs: {
      description: 'Identifies unused exports.',
      recommended: false,
    },
    messages: {
      unusedExport: "Export '{{exportName}}' is unused.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          tsConfigPath: {
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
    type: 'layout',
  },
  name: 'no-unused-exports',
});
