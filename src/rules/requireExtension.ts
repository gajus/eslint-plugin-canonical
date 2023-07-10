import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { type TSESTree } from '@typescript-eslint/utils';
import {
  type RuleContext,
  type RuleFixer,
} from '@typescript-eslint/utils/dist/ts-eslint';
import resolveImport from 'eslint-module-utils/resolve';
import { createRule } from '../utilities';

const extensions = ['.js', '.ts', '.tsx'];

type Options = [];

type MessageIds = 'extensionMissing';

type Node = TSESTree.ExportNamedDeclaration | TSESTree.ImportDeclaration;

const isExistingFile = (fileName: string) => {
  return existsSync(fileName) && lstatSync(fileName).isFile();
};

const fixRelativeImport = (
  fixer: RuleFixer,
  node: Node,
  fileName: string,
  overrideExtension: boolean = true,
) => {
  if (!node.source) {
    throw new Error('Node has no source');
  }

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

const fixPathImport = (
  fixer: RuleFixer,
  node: Node,
  fileName: string,
  resolvedImportPath: string,
  overrideExtension: boolean = true,
) => {
  if (!node.source) {
    throw new Error('Node has no source');
  }

  const importPath = node.source.value;

  const lastSegment = importPath.split('/').pop();

  for (const extension of extensions) {
    if (resolvedImportPath.endsWith(lastSegment + extension)) {
      return fixer.replaceTextRange(
        node.source.range,
        `'${node.source.value + (overrideExtension ? '.js' : extension)}'`,
      );
    }
  }

  for (const extension of extensions) {
    if (resolvedImportPath.endsWith(lastSegment + '/index' + extension)) {
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

type AliasPaths = {
  [key: string]: string[];
};

type TSConfig = {
  compilerOptions: {
    paths?: AliasPaths;
  };
};

const endsWith = (subject: string, needles: string[]) => {
  return needles.some((needle) => {
    return subject.endsWith(needle);
  });
};

const createTSConfigFinder = () => {
  const cache: Record<string, TSConfig | null> = {};

  return (fileName: string) => {
    if (cache[fileName] !== undefined) {
      return cache[fileName];
    }

    let tsconfig: TSConfig;

    try {
      tsconfig = JSON.parse(readFileSync(fileName, 'utf8'));
    } catch {
      throw new Error(`Failed to parse TSConfig ${fileName}`);
    }

    cache[fileName] = tsconfig;

    return tsconfig;
  };
};

const findTSConfig = createTSConfigFinder();

const handleRelativePath = (
  context: RuleContext<'extensionMissing', []>,
  node: Node,
  importPath: string,
) => {
  if (!importPath.startsWith('.')) {
    return false;
  }

  // This would mean that the import path resolves to a non-JavaScript file, e.g. CSS import.
  if (isExistingFile(resolve(dirname(context.getFilename()), importPath))) {
    return true;
  }

  context.report({
    fix(fixer) {
      return fixRelativeImport(fixer, node, context.getFilename());
    },
    messageId: 'extensionMissing',
    node,
  });

  return true;
};

const handleAliasPath = (
  context: RuleContext<'extensionMissing', []>,
  node: Node,
  importPath: string,
) => {
  // @ts-expect-error we know this setting exists
  const project = (context.settings['import/resolver']?.typescript?.project ??
    null) as string | null;

  if (typeof project !== 'string') {
    return false;
  }

  const tsconfig = findTSConfig(project);

  if (!tsconfig) {
    return false;
  }

  const resolvedImportPath: string | null = resolveImport(importPath, context);

  if (!resolvedImportPath) {
    return false;
  }

  // This would mean that the import path resolves to a non-JavaScript file, e.g. CSS import.
  if (!endsWith(resolvedImportPath, extensions)) {
    return true;
  }

  context.report({
    fix(fixer) {
      return fixPathImport(
        fixer,
        node,
        context.getFilename(),
        resolvedImportPath,
      );
    },
    messageId: 'extensionMissing',
    node,
  });

  return true;
};

export default createRule<Options, MessageIds>({
  create: (context) => {
    const rule = (node: Node) => {
      if (!node.source) {
        // export { foo };
        // export const foo = () => {};
        return;
      }

      const importPath = node.source.value;

      const importPathHasExtension = endsWith(importPath, extensions);

      if (importPathHasExtension) {
        return;
      }

      void (
        handleRelativePath(context, node, importPath) ||
        handleAliasPath(context, node, importPath)
      );
    };

    return {
      ExportNamedDeclaration: rule,
      ImportDeclaration: rule,
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Require file extension in import and export statements',
      recommended: 'error',
    },
    fixable: 'code',
    messages: {
      extensionMissing: 'Must include file extension',
    },
    schema: [],
    type: 'layout',
  },
  name: 'require-extension',
});
