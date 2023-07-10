import {relative, dirname} from 'node:path';
import { readFileSync } from 'node:fs';
import { type TSESTree } from '@typescript-eslint/utils';
import parse from 'eslint-module-utils/parse';
import resolveImport from 'eslint-module-utils/resolve';
import { createRule } from '../utilities';
import { default as ExportMap } from './ExportMap';

type Options = [];

type MessageIds = 'noBarrelImport';

export default createRule<Options, MessageIds>({
  create: (context) => {
    const myPath = context.getFilename();

    // can't cycle-check a non-file
    if (myPath === '<text>') return {};

    return {
      ImportSpecifier: (node) => {
        const importDeclarationNode = node.parent as TSESTree.ImportDeclaration;

        const exportMap = ExportMap.get(
          importDeclarationNode.source.value,
          context,
        );

        if (exportMap === null) {
          return;
        }

        const identifierNode = (node.imported) as unknown as TSESTree.Identifier;

        if (identifierNode.type !== 'Identifier') {
          throw new Error('Expected identifier');
        }

        const reexport = exportMap.reexports.get(identifierNode.name);

        // If it is not re-exported, then it must be defined locally.
        if (!reexport) {
          return;
        }



        context.report({
          fix(fixer) {
            return fixer.replaceTextRange(importDeclarationNode.range, `import { ${identifierNode.name} } from './foo';`);
          },
          messageId: 'noBarrelImport',
          node,
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Require that imports are made directly from the source',
      recommended: 'error',
    },
    fixable: 'code',
    messages: {
      noBarrelImport: 'Must not import from a barrel file',
    },
    schema: [],
    type: 'layout',
  },
  name: 'require-extension',
});
