import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { type TSESTree } from '@typescript-eslint/utils';
import { type RuleFixer } from '@typescript-eslint/utils/dist/ts-eslint';
import resolveImport from 'eslint-module-utils/resolve';
import { createRule } from '../utilities';

const extensions = ['.js', '.ts', '.tsx'];

type Options = [];

type MessageIds = 'extensionMissing';

const isExistingFile = (fileName: string) => {
  return existsSync(fileName) && lstatSync(fileName).isFile();
};

const fixRelativeImport = (
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

const fixPathImport = (
  fixer: RuleFixer,
  node: TSESTree.ImportDeclaration,
  fileName: string,
  aliasPath: string,
  resolvedImportPath: string,
  overrideExtension: boolean = true,
) => {
  const importPath = node.source.value.replace(aliasPath, '');

  for (const extension of extensions) {
    if (resolvedImportPath.endsWith(importPath + extension)) {
      return fixer.replaceTextRange(
        node.source.range,
        `'${node.source.value + (overrideExtension ? '.js' : extension)}'`,
      );
    }
  }

  for (const extension of extensions) {
    if (resolvedImportPath.endsWith(importPath + '/index' + extension)) {
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

const findAliasPath = (aliasPaths: AliasPaths, importPath: string) => {
  return Object.keys(aliasPaths).find((path) => {
    if (!path.endsWith('*')) {
      return false;
    }

    const pathWithoutWildcard = path.slice(0, -1);

    return importPath.startsWith(pathWithoutWildcard);
  });
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

    const tsconfig: TSConfig = JSON.parse(readFileSync(fileName, 'utf8'));

    cache[fileName] = tsconfig;

    return tsconfig;
  };
};

const findTSConfig = createTSConfigFinder();

export default createRule<Options, MessageIds>({
  create: (context) => {
    return {
      ImportDeclaration: (node) => {
        const importPath = node.source.value;

        const importPathHasExtension = endsWith(importPath, extensions);

        if (importPathHasExtension) {
          return;
        }

        if (importPath.startsWith('.')) {
          context.report({
            fix(fixer) {
              return fixRelativeImport(fixer, node, context.getFilename());
            },
            messageId: 'extensionMissing',
            node,
          });

          return;
        }

        // @ts-expect-error we know this setting exists
        const project = (context.settings['import/resolver']?.typescript
          ?.project ?? null) as string | null;

        if (typeof project !== 'string') {
          return;
        }

        const tsconfig = findTSConfig(project);

        const paths = tsconfig?.compilerOptions?.paths;

        if (!paths) {
          return;
        }

        const aliasPath = findAliasPath(paths, importPath);

        if (!aliasPath) {
          return;
        }

        const aliasPathWithoutWildcard = aliasPath.slice(0, -1);

        if (!aliasPathWithoutWildcard) {
          throw new Error('Path without wildcard is empty');
        }

        const resolvedImportPath: string | null = resolveImport(
          importPath,
          context,
        );

        if (!resolvedImportPath) {
          return;
        }

        context.report({
          fix(fixer) {
            return fixPathImport(
              fixer,
              node,
              context.getFilename(),
              aliasPathWithoutWildcard,
              resolvedImportPath,
            );
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
