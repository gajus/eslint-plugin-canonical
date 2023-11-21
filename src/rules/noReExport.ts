/**
 * The code is adapted from https://github.com/christianvuerings/eslint-plugin-no-re-export
 */
import { type TSESTree } from '@typescript-eslint/types';
import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { createRule } from '../utilities';

type Options = [];

type MessageIds = 'noReExport';

type ReportInfo = {
  location: TSESTree.SourceLocation;
  type:
    | 'DefaultReExport'
    | 'ExportDefault'
    | 'ExportObject'
    | 'ObjectProperty'
    | 'Variable';
};

export default createRule<Options, MessageIds>({
  create(context) {
    const imports = new Map();
    const exports: Record<string, ReportInfo[]> = {};

    const appendToExports = (name: string, reportInfo: ReportInfo) => {
      exports[name] = [...(exports[name] ? exports[name] : []), reportInfo];
    };

    return {
      // export * from 'app/CustomCustomButton'
      ExportAllDeclaration(node) {
        context.report({
          data: {
            name: node.source.value,
          },
          loc: node.loc,
          messageId: 'noReExport',
        });
      },

      ExportDefaultDeclaration(node) {
        if (node.declaration.type === AST_NODE_TYPES.Identifier) {
          // export default Button
          appendToExports(node.declaration.name, {
            location: node.declaration.loc,
            type: 'ExportDefault',
          });
        }
      },

      ExportNamedDeclaration(node) {
        if (
          node.declaration &&
          node.declaration?.type === AST_NODE_TYPES.VariableDeclaration &&
          node.declaration.declarations
        ) {
          for (const declaration of node.declaration.declarations) {
            if (
              declaration.init?.type === AST_NODE_TYPES.Identifier &&
              declaration.init?.name
            ) {
              // export const CustomButtom = Button;
              appendToExports(declaration.init.name, {
                location: declaration.init.loc,
                type: 'Variable',
              });
            } else if (
              declaration.init?.type === AST_NODE_TYPES.ObjectExpression &&
              declaration.init.properties
            ) {
              for (const property of declaration.init.properties) {
                if (
                  property?.type === AST_NODE_TYPES.Property &&
                  property.value.type === AST_NODE_TYPES.Identifier &&
                  property.value?.name
                ) {
                  // export const CustomButton = { Button }
                  appendToExports(property.value.name, {
                    location: property.loc,
                    type: 'ObjectProperty',
                  });
                }
              }
            }
          }
        } else if (node.specifiers) {
          for (const specifier of node.specifiers) {
            if (node.source && specifier.local.name === 'default') {
              // export { default as Button } from 'app/CustomButtom';
              appendToExports(specifier.exported.name, {
                location: specifier.exported.loc,
                type: 'DefaultReExport',
              });
            } else {
              // export { Button }
              appendToExports(specifier.local.name, {
                location: specifier.local.loc,
                type: 'ExportObject',
              });
            }
          }
        }
      },

      ImportDefaultSpecifier(node) {
        imports.set(node.local.name, { node });
      },
      ImportNamespaceSpecifier(node) {
        imports.set(node.local.name, { node });
      },
      ImportSpecifier(node) {
        imports.set(node.local.name, { node });
      },
      'Program:exit': () => {
        for (const exportName of Object.keys(exports)) {
          const reportInfoList = exports[exportName];
          for (const { location, type } of reportInfoList) {
            if (imports.has(exportName) || type === 'DefaultReExport') {
              context.report({
                data: {
                  name: exportName,
                },
                loc: location,
                messageId: 'noReExport',
              });
            }
          }
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallows re-exports of imports.',
    },
    messages: {
      noReExport: "Do not re-export '{{name}}'",
    },
    schema: [],
    type: 'layout',
  },
  name: 'no-re-export',
});
