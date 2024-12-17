/**
 * https://github.com/eslint/eslint/blob/b7ef2f34fe12b68a366e1b4bf5f64d7332c6e72e/lib/rules/no-restricted-imports.js
 */

import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { type TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../utilities';

type Options = [
  {
    paths: Array<{ importName?: string; message: string; name: string }>;
  },
];

const messages = {
  everything:
    "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted. {{customMessage}}",
  importName:
    "'{{importName}}' import from '{{importSource}}' is restricted. {{customMessage}}",
  path: "'{{importSource}}' import is restricted from being used. {{customMessage}}",
};

export default createRule<Options, keyof typeof messages>({
  create: (context) => {
    const options = Array.isArray(context.options) ? context.options : [];

    const restrictedPaths = options[0]?.paths ?? [];

    if (Object.keys(restrictedPaths).length === 0) {
      return {};
    }

    const checkNode = (node: TSESTree.ImportDeclaration) => {
      const importSource = node.source.value.trim();

      const importRules = restrictedPaths.filter(
        (path) => path.name === importSource,
      );

      if (importRules.length === 0) {
        return;
      }

      for (const importRule of importRules) {
        const importName = importRule.importName;

        if (!importName) {
          context.report({
            data: {
              customMessage: importRule.message,
              importSource,
            },
            messageId: 'path',
            node: node.source,
          });

          continue;
        }

        if (importName === 'default') {
          for (const nodeSpecifier of node.specifiers) {
            if (nodeSpecifier.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
              context.report({
                data: {
                  customMessage: importRule.message,
                  importName: 'default',
                  importSource,
                },
                messageId: 'importName',
                node: nodeSpecifier,
              });
            }
          }
        }

        if (
          importName === '*' &&
          node.specifiers[0].type === AST_NODE_TYPES.ImportNamespaceSpecifier
        ) {
          context.report({
            data: {
              customMessage: importRule.message,
              importNames: '*',
              importSource,
            },
            messageId: 'everything',
            node: node.source,
          });

          return;
        }

        const importSpecifiers = node.specifiers.filter(
          (specifier) =>
            specifier.type === AST_NODE_TYPES.ImportSpecifier &&
            specifier.imported.type === AST_NODE_TYPES.Identifier &&
            specifier.imported.name === importName,
        );

        if (importSpecifiers.length === 0) {
          continue;
        }

        context.report({
          data: {
            customMessage: importRule.message,
            importName,
            importSource,
          },
          messageId: 'importName',
          node: importSpecifiers[0],
        });
      }
    };

    return {
      ImportDeclaration: checkNode,
    };
  },
  defaultOptions: [
    {
      paths: [],
    },
  ],
  meta: {
    docs: {
      description: 'Disallow specified modules when loaded by `import`',
    },
    messages,
    schema: [
      {
        additionalProperties: false,
        properties: {
          paths: {
            items: {
              additionalProperties: false,
              properties: {
                importName: {
                  type: 'string',
                },
                message: {
                  minLength: 1,
                  type: 'string',
                },
                name: { type: 'string' },
              },
              required: ['name'],
              type: 'object',
            },
            type: 'array',
            uniqueItems: true,
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'no-restricted-imports',
});
