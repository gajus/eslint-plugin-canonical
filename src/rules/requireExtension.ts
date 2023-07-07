import { createRule } from '../utilities';

type Options = [];

type MessageIds = 'extensionMissing';

export default createRule<Options, MessageIds>({
  create: (context) => {
    return {
      ImportDeclaration: (node) => {
        const importPath = node.source.value;

        if (!importPath.startsWith('.')) {
          return;
        }

        const importPathHasExtension = importPath.endsWith('.js');

        if (importPathHasExtension) {
          return;
        }

        context.report({
          fix(fixer) {
            return fixer.replaceTextRange(
              node.source.range,
              `'${importPath}.js'`,
            );
          },
          messageId: 'extensionMissing',
          node,
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: '',
      recommended: 'error',
    },
    fixable: 'code',
    messages: {
      extensionMissing: 'Must include file extension "{{extension}}"',
    },
    schema: [],
    type: 'layout',
  },
  name: 'require-extension',
});
