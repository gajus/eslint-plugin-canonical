import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { type TSESTree } from '@typescript-eslint/utils';
import parse from 'eslint-module-utils/parse';
import resolve from 'eslint-module-utils/resolve';
import visit from 'eslint-module-utils/visit';
import { Logger } from '../Logger';
import { createRule } from '../utilities';

const log = Logger.child({
  rule: 'virtual-module',
});

type Options =
  | [
      {
        includeModules?: string[];
      },
    ]
  | [];

type MessageIds = 'indexImport' | 'parentModuleImport' | 'privateModuleImport';

const findClosestDirectoryWithNeedle = (
  startPath: string,
  needleFileName: string,
  rootPath: string,
  allowList: string[] | null = null,
): string | null => {
  let currentDirectory = path.resolve(startPath, './');

  while (currentDirectory.startsWith(rootPath)) {
    if (
      existsSync(path.resolve(currentDirectory, needleFileName)) &&
      (allowList === null || allowList.includes(currentDirectory))
    ) {
      return currentDirectory;
    }

    currentDirectory = path.resolve(currentDirectory, '..');
  }

  return null;
};

const findProjectRoot = (startPath: string): string => {
  const projectRoot = findClosestDirectoryWithNeedle(
    startPath,
    'package.json',
    '/',
  );

  if (!projectRoot) {
    throw new Error('Project root could not be found.');
  }

  return projectRoot;
};

const findModuleRoot = (
  startPath: string,
  rootPath: string,
  allowList: string[] | null = null,
): string | null => {
  const moduleRoot = findClosestDirectoryWithNeedle(
    startPath,
    'index.ts',
    rootPath,
    allowList,
  );

  return moduleRoot;
};

const getAllNamedExportNames = (filePath: string, context): string[] => {
  const content = readFileSync(filePath, 'utf8');

  const { ast, visitorKeys } = parse(filePath, content, context);

  const namedExportNames: string[] = [];

  visit(ast, visitorKeys, {
    ExportNamedDeclaration(node) {
      for (const declaration of node.declaration?.declarations ?? []) {
        namedExportNames.push(declaration.id.name);
      }

      for (const specifier of node.specifiers) {
        if (specifier.type === 'ExportSpecifier') {
          namedExportNames.push(specifier.name);
        }
      }
    },
  });

  return namedExportNames;
};

/**
 * This implementation will unlikely work in real-world setup.
 *
 * @todo Investigate the proper way of determining import
 */
const stripPrivatePath = (
  importPath: string,
  privatePath: string,
): string | null => {
  const steps = privatePath.split('/').length;

  return importPath
    .split('/')
    .slice(0, -1 * steps)
    .join('/');
};

export default createRule<Options, MessageIds>({
  create: (context, [options]) => {
    const visitDeclaration = (
      node:
        | TSESTree.ExportAllDeclaration
        | TSESTree.ExportNamedDeclaration
        | TSESTree.ImportDeclaration,
    ) => {
      let includeModules = options?.includeModules ?? null;

      if (includeModules) {
        includeModules = includeModules.map((modulePath) => {
          return path.dirname(modulePath);
        });
      }

      const currentDirectory = path.dirname(context.getFilename());
      const projectRootDirectory = findProjectRoot(currentDirectory);

      const importPath = node.source?.value;

      if (!importPath) {
        return;
      }

      const resolvedImportPath: string | null = resolve(importPath, context);

      if (!resolvedImportPath) {
        log.error({ importPath }, 'cannot resolve import');

        throw new Error('Cannot resolve import.');

        return;
      }

      const targetModuleDirectory = findModuleRoot(
        resolvedImportPath,
        projectRootDirectory,
        includeModules,
      );

      if (!targetModuleDirectory) {
        return;
      }

      const resolvedVirtualModuleEntry = path.resolve(
        targetModuleDirectory,
        'index.ts',
      );

      const resolvedImportIsVirtualModuleEntry =
        resolvedImportPath === resolvedVirtualModuleEntry;

      const currentModuleDirectory = findModuleRoot(
        currentDirectory,
        projectRootDirectory,
        includeModules,
      );

      if (currentModuleDirectory === targetModuleDirectory) {
        if (resolvedImportIsVirtualModuleEntry) {
          context.report({
            messageId: 'indexImport',
            node,
          });
        }

        return;
      }

      if (currentDirectory.startsWith(targetModuleDirectory + path.sep)) {
        context.report({
          data: {
            currentModule:
              path.sep + path.relative(projectRootDirectory, currentDirectory),
            parentModule:
              path.sep +
              path.relative(projectRootDirectory, targetModuleDirectory),
          },
          messageId: 'parentModuleImport',
          node,
        });

        return;
      }

      const targetParentModuleDirectory = findModuleRoot(
        path.resolve(targetModuleDirectory + path.sep + '..'),
        projectRootDirectory,
        includeModules,
      );

      const reportModule = targetParentModuleDirectory ?? targetModuleDirectory;

      if (
        reportModule === targetModuleDirectory &&
        resolvedImportIsVirtualModuleEntry
      ) {
        log.debug('valid import');

        return;
      }

      context.report({
        data: {
          privatePath:
            path.sep + path.relative(targetModuleDirectory, resolvedImportPath),
          targetModule:
            path.sep + path.relative(projectRootDirectory, reportModule),
        },
        fix: (fixer) => {
          if (node.type === 'ImportDeclaration') {
            const namedExports = getAllNamedExportNames(
              resolvedVirtualModuleEntry,
              context,
            );

            for (const specifier of node.specifiers) {
              if (specifier.type !== 'ImportSpecifier') {
                return null;
              }

              if (!namedExports.includes(specifier.imported.name)) {
                return null;
              }
            }

            let newImportPath = path.relative(currentDirectory, reportModule);

            const maybeBetterPath = stripPrivatePath(
              importPath,
              path.relative(targetModuleDirectory, resolvedImportPath),
            );

            if (maybeBetterPath) {
              const resolvedBetterPath: string | null = resolve(
                maybeBetterPath,
                context,
              );

              if (
                resolvedBetterPath === path.resolve(reportModule, 'index.ts')
              ) {
                newImportPath = maybeBetterPath;
              }
            }

            if (!newImportPath) {
              return null;
            }

            return fixer.replaceText(
              node,
              context.getSourceCode().getText(node).split('}')[0] +
                `} from '${newImportPath}'`,
            );
          }

          return null;
        },
        messageId: 'privateModuleImport',
        node,
      });
    };

    return {
      ExportAllDeclaration: visitDeclaration,
      ExportNamedDeclaration: visitDeclaration,
      ImportDeclaration: visitDeclaration,
    };
  },
  defaultOptions: [{ includeModules: undefined }],
  meta: {
    docs: {
      description: '',
      recommended: 'error',
    },
    fixable: 'whitespace',
    messages: {
      indexImport:
        'Cannot import virtual module index from within the virtual module itself.',
      parentModuleImport:
        'Cannot import a parent virtual module. {{parentModule}} is a parent of {{currentModule}}.',
      privateModuleImport:
        'Cannot import a private path. {{privatePath}} belongs to {{targetModule}} virtual module.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          includeModules: {
            description:
              'A list of barrel files that identify virtual modules. Provide absolute paths to the index.ts files. If this value is not provided, then all barrel files in the project are assumed to be virtual module boundaries.',
            items: {
              type: 'string',
            },
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'layout',
  },
  name: 'import-specifiers-newline',
});
