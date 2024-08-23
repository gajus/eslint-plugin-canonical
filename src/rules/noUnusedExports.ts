import analyzeTsConfig from 'ts-unused-exports';
import { createRule } from '../utilities';

const defaultOptions = {
  allowUnusedEnums: false,
  allowUnusedTypes: false,
  tsConfigPath: '',
};

type Options = [
  {
    allowUnusedEnums?: boolean;
    allowUnusedTypes?: boolean;
    tsConfigPath: string;
  },
];

type MessageIds = 'unusedExport';

export default createRule<Options, MessageIds>({
  create: (context, [options]) => {
    const tsUnusedOptions: string[] = [];

    if (options.allowUnusedEnums) {
      tsUnusedOptions.push('--allowUnusedEnums');
    }

    if (options.allowUnusedTypes) {
      tsUnusedOptions.push('--allowUnusedTypes');
    }

    const result = analyzeTsConfig(options.tsConfigPath, tsUnusedOptions);

    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const filename = context.filename ?? context.getFilename();

    return {
      Program() {
        if (!result[filename]) {
          return;
        }

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
    },
    messages: {
      unusedExport: "Export '{{exportName}}' is unused.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowUnusedEnums: {
            type: 'boolean',
          },
          allowUnusedTypes: {
            type: 'boolean',
          },
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
