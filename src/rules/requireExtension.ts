import { existsSync, lstatSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { type TSESTree } from '@typescript-eslint/utils';
import { type RuleFixer } from '@typescript-eslint/utils/dist/ts-eslint';
import { createRule } from '../utilities';

const extensions = ['.ts', '.tsx'];

type Options = [];

type MessageIds = 'extensionMissing';

const isExistingFile = (fileName: string) => {
  return existsSync(fileName) && lstatSync(fileName).isFile();
};

const fix = (
  fixer: RuleFixer,
  node: TSESTree.ImportDeclaration,
  fileName: string,
  overrideExtension: boolean = true,
) => {
  const importPath = resolve(dirname(fileName), node.source.value);

  for (const extension of extensions) {
    if (isExistingFile(importPath + extension)) {
      return fixer.replaceTextRange(
        node.source.range,
        `'${node.source.value + (overrideExtension ? '.js' : extension)}'`,
      );
    }
  }

  for (const extension of extensions) {
    if (isExistingFile(resolve(importPath, 'index') + extension)) {
      return fixer.replaceTextRange(
        node.source.range,
        `'${
          node.source.value + '/index' + (overrideExtension ? '.js' : extension)
        }'`,
      );
    }
  }

  return null;
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
            return fix(fixer, node, context.getFilename());
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
