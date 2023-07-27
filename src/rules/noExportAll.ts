import { type TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utilities';
import ExportMapAny from './ExportMap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ExportMap = ExportMapAny as any;

type Options = [];

type MessageIds = 'noExportAll';

export default createRule<Options, MessageIds>({
  create: (context) => {
    return {
      ExportAllDeclaration(node: TSESTree.ExportAllDeclaration) {
        const exportMap = ExportMap.get(node.source.value, context);

        if (exportMap === null) {
          return;
        }

        const exportNames = Array.from(exportMap.namespace.keys()).filter(
          (key) => key !== 'default',
        );

        context.report({
          fix(fixer) {
            return fixer.replaceTextRange(
              node.range,
              `export { ${exportNames.join(', ')} } from '${
                node.source.value
              }';`,
            );
          },
          messageId: 'noExportAll',
          node,
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Requite that re-exports are named',
      recommended: 'recommended',
    },
    fixable: 'code',
    messages: {
      noExportAll: 'Must not use export *',
    },
    schema: [],
    type: 'layout',
  },
  name: 'require-extension',
});
