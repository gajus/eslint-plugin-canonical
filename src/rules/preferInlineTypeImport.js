const removeTypeSpecifier = function *(fixer, sourceCode, node) {
  const importKeyword = sourceCode.getFirstToken(node);

  const typeIdentifier = sourceCode.getTokenAfter(importKeyword);

  yield fixer.remove(typeIdentifier);

  if (importKeyword.loc.end.column + 1 === typeIdentifier.loc.start.column) {
    yield fixer.removeRange([
      importKeyword.range[1],
      importKeyword.range[1] + 1,
    ]);
  }
};

export default {
  create: (context) => {
    const sourceCode = context.getSourceCode();
    return {
      ImportDeclaration: (node) => {
        if (node.importKind === 'type') {
          context.report({
            *fix (fixer) {
              yield* removeTypeSpecifier(fixer, sourceCode, node);

              for (const specifier of node.specifiers) {
                yield fixer.insertTextBefore(specifier, 'type ');
              }
            },
            loc: node.loc,
            messageId: 'noTypeImport',
            node,
          });
        }
      },
    };
  },
  meta: {
    fixable: 'code',
    messages: {
      noTypeImport: 'Type imports must be inlined',
    },
    schema: [],
    type: 'suggestion',
  },
};
