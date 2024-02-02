import { dirname, relative, isAbsolute } from 'node:path';
import { type TSESTree, type TSESLint } from '@typescript-eslint/utils';
import * as recast from 'recast';
import { createRule, findRootPath } from '../utilities';
import { findDirectory } from '../utilities/findDirectory';
import ExportMapAny from './ExportMap';

/**
 * https://stackoverflow.com/a/45242825/368691
 */
const isSubPath = (parent: string, subject: string) => {
  const rel = relative(parent, subject);

  return rel && !rel.startsWith('..') && !isAbsolute(rel);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ExportMap = ExportMapAny as any;

type Options = [];

type MessageIds = 'noBarrelImport';

const formatRelativeImport = (
  currentFilename: string,
  importFilename: string,
) => {
  let newImport = relative(dirname(currentFilename), importFilename);

  if (!newImport.startsWith('.')) {
    newImport = './' + newImport;
  }

  return newImport.replace(/\.tsx?$/u, '');
};

type ModuleExports = {
  getImport: () => {
    path: string;
  } | null;
  local: string;
};

const findImportSource = (
  context: TSESLint.RuleContext<MessageIds, Options>,
  moduleExport: ModuleExports,
) => {
  const local = moduleExport.local;
  const modulePath = moduleExport.getImport()?.path;

  if (!modulePath) {
    return null;
  }

  const moduleExports = ExportMap.get(modulePath, context);

  if (moduleExports.namespace.has(local)) {
    return {
      local,
      path: modulePath,
    };
  }

  const reexport = moduleExports.reexports.get(local);

  if (!reexport) {
    // throw new Error('Re-export not found');
    return null;
  }

  return findImportSource(context, reexport);
};

export default createRule<Options, MessageIds>({
  create: (context) => {
    const myPath = context.getFilename();

    // can't cycle-check a non-file
    if (myPath === '<text>') return {};

    const myModuleRoot = findDirectory(
      dirname(myPath),
      'package.json',
      findRootPath(myPath),
    );

    if (!myModuleRoot) {
      throw new Error('cannot find package.json');
    }

    return {
      ImportDefaultSpecifier: (node) => {
        const importDeclarationNode = node.parent as TSESTree.ImportDeclaration;

        const exportMap = ExportMap.get(
          importDeclarationNode.source.value,
          context,
        );

        if (exportMap === null) {
          return;
        }

        const reexport = exportMap.reexports.get('default');

        if (!reexport) {
          return;
        }

        const importSource = findImportSource(context, reexport);

        if (!importSource) {
          return;
        }

        if (!isSubPath(myModuleRoot, importSource.path)) {
          return;
        }

        const relativeImportPath = formatRelativeImport(
          myPath,
          importSource.path,
        );

        // This is a temporary approach to avoid rewriting imports of packages.
        // In practice, we want to ensure that we are not importing barrels either.
        if (relativeImportPath.includes('node_modules')) {
          return;
        }

        const newImport = `import ${node.local.name} from '${relativeImportPath}';`;

        context.report({
          fix(fixer) {
            return fixer.replaceTextRange(
              importDeclarationNode.range,
              newImport,
            );
          },
          messageId: 'noBarrelImport',
          node,
        });
      },
      ImportSpecifier: (node) => {
        const importDeclarationNode = node.parent as TSESTree.ImportDeclaration;

        const exportMap = ExportMap.get(
          importDeclarationNode.source.value,
          context,
        );

        if (exportMap === null) {
          return;
        }

        const importedNode = node.imported as TSESTree.Identifier;

        if (importedNode.type !== 'Identifier') {
          throw new Error('Expected identifier');
        }

        const localNode = node.local as TSESTree.Identifier;

        if (localNode.type !== 'Identifier') {
          throw new Error('Expected identifier');
        }

        const reexport = exportMap.reexports.get(importedNode.name);

        // If it is not re-exported, then it must be defined locally.
        if (!reexport) {
          return;
        }

        const importSource = findImportSource(context, reexport);

        if (!importSource) {
          return;
        }

        if (!isSubPath(myModuleRoot, importSource.path)) {
          return;
        }

        const relativeImportPath = formatRelativeImport(
          myPath,
          importSource.path,
        );

        // This is a temporary approach to avoid rewriting imports of packages.
        // In practice, we want to ensure that we are not importing barrels either.
        if (relativeImportPath.includes('node_modules')) {
          return;
        }

        const newImport = `import { ${
          node.importKind === 'type' ? 'type ' : ''
        }${
          importSource.local === localNode.name
            ? importSource.local
            : `${importSource.local} as ${localNode.name}`
        } } from '${relativeImportPath}';`;

        if (importDeclarationNode.specifiers.length === 1) {
          context.report({
            fix(fixer) {
              return fixer.replaceTextRange(
                importDeclarationNode.range,
                newImport,
              );
            },
            messageId: 'noBarrelImport',
            node,
          });
        } else {
          context.report({
            fix(fixer) {
              return fixer.replaceTextRange(
                importDeclarationNode.range,
                recast.print(
                  {
                    ...importDeclarationNode,
                    // @ts-expect-error TODO
                    specifiers: importDeclarationNode.specifiers.filter(
                      (specifier) => specifier !== node,
                    ),
                  },
                  {
                    quote: 'single',
                  },
                ).code +
                  '\n' +
                  newImport,
              );
            },
            messageId: 'noBarrelImport',
            node,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Require that imports are made directly from the source',
      recommended: 'recommended',
    },
    fixable: 'code',
    messages: {
      noBarrelImport: 'Must not import from a barrel file',
    },
    schema: [],
    type: 'layout',
  },
  name: 'require-extension',
});
