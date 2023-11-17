import { createRule } from '../utilities';

type Options = [];

type MessageIds = 'noDestructureNamespace';

export default createRule<Options, MessageIds>({
  create: (context) => {
    return {
      VariableDeclarator(node) {
        if (
          node.id.type === 'ObjectPattern' &&
          node.init &&
          node.init.type === 'Identifier'
        ) {
          const importDeclaration = context
            .getScope()
            // @ts-expect-error we expect .name to be set
            .variables.find((variable) => variable.name === node.init?.name)
            ?.defs[0]?.parent;
          if (
            importDeclaration &&
            importDeclaration.type === 'ImportDeclaration' &&
            importDeclaration.specifiers.some(
              (specifier) => specifier.type === 'ImportNamespaceSpecifier',
            )
          ) {
            context.report({
              messageId: 'noDestructureNamespace',
              node,
            });
          }
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Disallows the practice of importing an entire module's namespace using import * as Namespace and then destructuring specific exports from it. Instead, it encourages direct importing of only the necessary named exports from a module.",
    },
    messages: {
      noDestructureNamespace:
        'Do not destructure namespace imports; import only specific members needed.',
    },
    schema: [],
    type: 'layout',
  },
  name: 'no-import-namespace-destructure',
});
