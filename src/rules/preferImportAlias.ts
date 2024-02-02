/* eslint-disable unicorn/no-array-reduce */

/**
 * @author Steven Sojka
 * @see https://github.com/steelsojka/eslint-import-alias
 */
import path from 'node:path';
import { sep as posixSeparator } from 'node:path/posix';
import { sep as win32Separator } from 'node:path/win32';
import { createRule } from '../utilities';

const RELATIVE_MATCHER = /^(?:(\.\/)|(\.\.\/))+/u;

const CWD = process.cwd();

type AliasInput = {
  alias: string;
  matchParent?: string;
  matchPath: string;
  maxRelativeDepth?: number;
};

type Options = [
  {
    aliases?: AliasInput[];
    baseDirectory: string;
  },
];

type MessageIds = 'mustBeAlias' | 'mustBeAliasOrShallow';

export default createRule<Options, MessageIds>({
  create: (context, [options]) => {
    const { aliases: temporaryAliases = [], baseDirectory = CWD } = options;

    const aliases = temporaryAliases.map((temporaryAlias) => {
      return {
        ...temporaryAlias,
        matchPath: new RegExp(temporaryAlias.matchPath, 'u'),
      };
    });

    return {
      ImportDeclaration(node) {
        const importValue = node.source.value;

        const accessor = importValue.match(RELATIVE_MATCHER)?.[0];

        if (!accessor) {
          return;
        }

        const parsedPath = path.parse(context.getFilename());

        // e.g. grandparentAccessor => '../../' => 2
        const depth = accessor === './' ? 0 : accessor.length / 3;

        const parentPath = path.resolve(
          baseDirectory,
          path.resolve(parsedPath.dir, '../'.repeat(depth)),
        );

        const importPath = path
          .relative(baseDirectory, path.resolve(parsedPath.dir, importValue))
          .replaceAll(win32Separator, posixSeparator);

        for (const item of aliases) {
          const { alias, matchPath, matchParent, maxRelativeDepth = -1 } = item;

          if (maxRelativeDepth < -1) {
            throw new Error('maxRelativeDepth cannot be less than -1');
          }

          if (depth < maxRelativeDepth) {
            continue;
          }

          if (matchParent && matchParent !== parentPath) {
            continue;
          }

          const pathMatch = importPath.match(matchPath);

          if (!pathMatch) {
            continue;
          }

          context.report({
            data: {
              maxRelativeDepth,
            },
            fix: (fixer) => {
              const matchingString = pathMatch[pathMatch.length - 1];
              const index = pathMatch[0].indexOf(matchingString);
              const newImportPath =
                importPath.slice(0, index) +
                alias +
                importPath.slice(index + matchingString.length);

              return fixer.replaceTextRange(
                [node.source.range[0] + 1, node.source.range[1] - 1],
                newImportPath,
              );
            },
            messageId:
              maxRelativeDepth === -1 ? 'mustBeAlias' : 'mustBeAliasOrShallow',
            node,
          });

          break;
        }
      },
    };
  },
  defaultOptions: [
    {
      aliases: [],
      baseDirectory: process.cwd(),
    },
  ],
  meta: {
    docs: {
      description:
        'Restrict imports to path aliases or relative imports limited by depth.',
      recommended: 'recommended',
    },
    fixable: 'code',
    messages: {
      mustBeAlias: 'Import path mush be a path alias',
      mustBeAliasOrShallow:
        'Import statement must be an alias or no more than {{maxRelativeDepth}} levels deep',
    },
    schema: [
      {
        properties: {
          aliases: {
            items: {
              properties: {
                alias: { type: 'string' },
                matchParent: { type: 'string' },
                matchPath: { type: 'string' },
                maxRelativeDepth: {
                  type: 'number',
                },
              },
              required: ['alias', 'matchPath'],
              type: 'object',
            },
            type: 'array',
          },
          cwd: {
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'prefer-import-alias',
});
