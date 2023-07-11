import { type TSESTree } from '@typescript-eslint/utils';
import * as recast from 'recast';
import { createRule } from '../utilities';
import ExportMap from './ExportMap';

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

        const importedNode = node.imported as TSESTree.Identifier;

        if (importedNode.type !== 'Identifier') {
          throw new Error('Expected identifier');
        }

        const localNode = node.local as TSESTree.Identifier;

        if (localNode.type !== 'Identifier') {
          throw new Error('Expected identifier');
        }

        const reexport = exportMap.reexports.get(importedNode.name);

        // If it is not re-exported, then it must be defined locally.
        if (!reexport) {
          return;
        }

        const newImport = `import { ${
          node.importKind === 'type' ? 'type ' : ''
        }${
          importedNode.name === localNode.name
            ? importedNode.name
            : `${importedNode.name} as ${localNode.name}`
        } } from './foo';`;

        if (importDeclarationNode.specifiers.length === 1) {
          context.report({
            fix(fixer) {
              return fixer.replaceTextRange(
                importDeclarationNode.range,
                newImport,
              );
            },
            messageId: 'noBarrelImport',
            node,
          });
        } else {
          context.report({
            fix(fixer) {
              return fixer.replaceTextRange(
                importDeclarationNode.range,
                recast.print(
                  {
                    ...importDeclarationNode,
                    // @ts-expect-error TODO
                    specifiers: importDeclarationNode.specifiers.filter(
                      (specifier) => specifier !== node,
                    ),
                  },
                  {
                    quote: 'single',
                  },
                ).code +
                  '\n' +
                  newImport,
              );
            },
            messageId: 'noBarrelImport',
            node,
          });
        }
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
