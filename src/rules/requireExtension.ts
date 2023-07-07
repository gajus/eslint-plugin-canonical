import { type TSESTree } from '@typescript-eslint/utils';
import { type RuleFixer } from '@typescript-eslint/utils/dist/ts-eslint';
import { createRule } from '../utilities';

type Options = [];

type MessageIds = 'extensionMissing';

const fix = (fixer: RuleFixer, node: TSESTree.ImportDeclaration) => {
  const importPath = node.source.value;

  return fixer.replaceTextRange(node.source.range, `'${importPath}.js'`);
};

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
            return fix(fixer, node);
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
