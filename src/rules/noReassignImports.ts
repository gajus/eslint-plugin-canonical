import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { createRule } from '../utilities';

type Options = [];

const messages = {
  noReassignImports: 'Do not reassign imports.',
};

export default createRule<Options, keyof typeof messages>({
  create: (context) => {
    const imported: string[] = [];

    return {
      ExportDefaultDeclaration(node) {
        const declaration = node.declaration;

        if (declaration?.type !== 'ObjectExpression') {
          return;
        }

        for (const property of declaration.properties) {
          if (property.type !== 'Property') {
            continue;
          }

          const key = property.key;

          if (key.type !== 'Identifier') {
            continue;
          }

          if (imported.includes(key.name)) {
            context.report({
              messageId: 'noReassignImports',
              node: key,
            });
          }
        }
      },
      ExportNamedDeclaration(node) {
        const declaration = node.declaration;

        if (declaration?.type !== 'VariableDeclaration') {
          return;
        }

        const variableDeclaration = declaration.declarations[0];

        if (variableDeclaration.type !== 'VariableDeclarator') {
          return;
        }

        const init = variableDeclaration.init;

        if (init?.type !== 'ObjectExpression') {
          return;
        }

        for (const property of init.properties) {
          if (property.type !== 'Property') {
            continue;
          }

          const key = property.key;

          if (key.type !== 'Identifier') {
            continue;
          }

          if (imported.includes(key.name)) {
            context.report({
              messageId: 'noReassignImports',
              node: key,
            });
          }
        }
      },
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) {
            continue;
          }

          if (specifier.imported.type !== AST_NODE_TYPES.Identifier) {
            continue;
          }

          imported.push(specifier.imported.name);
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Restricts re-assigning imports to variables that are exported.',
    },
    messages,
    schema: [],
    type: 'suggestion',
  },
  name: 'no-reassign-imports',
});
