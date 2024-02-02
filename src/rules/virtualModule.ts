import { readFileSync } from 'node:fs';
import path from 'node:path';
import { sep as posixSeparator } from 'node:path/posix';
import { sep as win32Separator } from 'node:path/win32';
import { type TSESTree } from '@typescript-eslint/utils';
import parse from 'eslint-module-utils/parse';
import resolve from 'eslint-module-utils/resolve';
import visit from 'eslint-module-utils/visit';
import { Logger } from '../Logger';
import { createRule, findRootPath } from '../utilities';
import { findDirectory } from '../utilities/findDirectory';

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

const findProjectRoot = (startPath: string): string => {
  const projectRoot = findDirectory(
    startPath,
    'package.json',
    findRootPath(startPath),
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
  const moduleRoot = findDirectory(startPath, 'index.ts', rootPath, allowList);

  return moduleRoot;
};

type NamedExport =
  | {
      name: string;
      source: string;
      type: 'specifier';
    }
  | {
      name: string;
      type: 'declaration';
    };

const getAllNamedExports = (filePath: string, context): NamedExport[] => {
  const content = readFileSync(filePath, 'utf8');

  const { ast, visitorKeys } = parse(filePath, content, context);

  const namedExports: NamedExport[] = [];

  visit(ast, visitorKeys, {
    ExportNamedDeclaration(node) {
      for (const declaration of node.declaration?.declarations ?? []) {
        namedExports.push({
          name: declaration.id.name,
          type: 'declaration',
        });
      }

      for (const specifier of node.specifiers) {
        if (specifier.type === 'ExportSpecifier') {
          namedExports.push({
            name: specifier.exported.name,
            source: node.source.value,
            type: 'specifier',
          });
        }
      }
    },
  });

  return namedExports;
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
        log.warn({ importPath }, 'cannot resolve import');

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
            fix: (fixer) => {
              if (node.type === 'ImportDeclaration') {
                const namedExports = getAllNamedExports(
                  resolvedVirtualModuleEntry,
                  context,
                );

                const newImports: string[] = [];

                for (const specifier of node.specifiers) {
                  if (specifier.type !== 'ImportSpecifier') {
                    return null;
                  }

                  const namedExport = namedExports.find((maybeNamedExport) => {
                    return maybeNamedExport.name === specifier.imported.name;
                  });

                  if (!namedExport || namedExport.type !== 'specifier') {
                    return null;
                  }

                  newImports.push(
                    `import { ${specifier.imported.name} } from '${namedExport.source}'`,
                  );
                }

                return fixer.replaceText(node, newImports.join('\n'));
              }

              return null;
            },
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
              posixSeparator +
              path
                .relative(projectRootDirectory, currentDirectory)
                .replaceAll(win32Separator, posixSeparator),
            parentModule:
              posixSeparator +
              path
                .relative(projectRootDirectory, targetModuleDirectory)
                .replaceAll(win32Separator, posixSeparator),
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
        return;
      }

      context.report({
        data: {
          privatePath:
            posixSeparator +
            path
              .relative(targetModuleDirectory, resolvedImportPath)
              .replaceAll(win32Separator, posixSeparator),
          targetModule:
            posixSeparator +
            path
              .relative(projectRootDirectory, reportModule)
              .replaceAll(win32Separator, posixSeparator),
        },
        fix: (fixer) => {
          if (node.type === 'ImportDeclaration') {
            const namedExports = getAllNamedExports(
              resolvedVirtualModuleEntry,
              context,
            );

            const namedExportNames = namedExports.map((namedExport) => {
              return namedExport.name;
            });

            for (const specifier of node.specifiers) {
              if (specifier.type !== 'ImportSpecifier') {
                return null;
              }

              if (!namedExportNames.includes(specifier.imported.name)) {
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
      recommended: 'recommended',
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
