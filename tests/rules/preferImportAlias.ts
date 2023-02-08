import path from 'node:path';
import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../../src/rules/preferImportAlias';

const baseDirectory = path.resolve(
  __dirname,
  '../../fixtures/preferImportAlias',
);

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('prefer-import-alias', rule, {
  invalid: [
    {
      code: `import { bar } from './bar';`,
      errors: [{ messageId: 'mustBeAlias' }],
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [
        {
          aliases: [
            {
              alias: '@/a/',
              matchPath: '^a\\/',
              maxRelativeDepth: -1,
            },
          ],
          baseDirectory,
        },
      ],
      output: `import { bar } from '@/a/b/c/bar';`,
    },
    {
      code: `import { baz } from '../baz';`,
      errors: [{ messageId: 'mustBeAliasOrShallow' }],
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [
        {
          aliases: [
            {
              alias: '@/a/',
              matchPath: '^a\\/',
              maxRelativeDepth: 1,
            },
          ],
          baseDirectory,
        },
      ],
      output: `import { baz } from '@/a/b/baz';`,
    },
    {
      code: `import { bar } from '../bar';`,
      errors: [{ messageId: 'mustBeAlias' }],
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [
        { aliases: [{ alias: '@/a/', matchPath: '^a\\/' }], baseDirectory },
      ],
      output: `import { bar } from '@/a/b/bar';`,
    },
  ],
  valid: [
    {
      code: `import { bar } from '../bar';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [
        {
          aliases: [
            { alias: '@/a/', matchParent: baseDirectory, matchPath: '^a\\/' },
          ],
          baseDirectory,
        },
      ],
    },
    {
      code: `import { foo } from '@bar/baz';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [
        {
          baseDirectory,
        },
      ],
    },
    {
      code: `import Foo from '@bar/baz';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [{ baseDirectory }],
    },
    {
      code: `import Foo, { Foo } from 'bar';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [{ baseDirectory }],
    },
    {
      code: `import { foo } from './foo';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [{ baseDirectory }],
    },
    {
      code: `import { foo } from '../foo';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [{ baseDirectory }],
    },
    {
      code: `import { foo } from '.././foo';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [{ baseDirectory }],
    },
    {
      code: `import { foo } from '././../foo';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [{ baseDirectory }],
    },
    {
      code: `import { foo } from '@bar/baz';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [{ baseDirectory }],
    },
    {
      code: `import { foo } from '../../foo';`,
      filename: path.join(baseDirectory, './a/b/c/foo.ts'),
      options: [{ baseDirectory }],
    },
  ],
});
