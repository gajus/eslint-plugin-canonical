import path from 'node:path';
import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../../src/rules/virtualModule';

const fixturesPath = path.resolve(__dirname, '../fixtures/virtualModule');

const typescriptExtensions = ['.ts', '.tsx', '.js', '.jsx'];

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  settings: {
    'import/extensions': typescriptExtensions,
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        extensions: typescriptExtensions,
        project: path.resolve(fixturesPath, 'tsconfig.json'),
      },
    },
  },
});

ruleTester.run('virtual-module', rule, {
  invalid: [
    {
      code: `import { Bar } from '@/Bar'`,
      errors: [
        {
          data: {
            currentModule: '/Bar/Baz',
            parentModule: '/Bar',
          },
          messageId: 'parentModuleImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Bar/Baz/index.ts'),
      name: '/Bar/Baz cannot import /Bar because /Bar is a parent of /Baz',
    },
    {
      code: `export { Bar } from '@/Bar'`,
      errors: [
        {
          data: {
            currentModule: '/Bar/Baz',
            parentModule: '/Bar',
          },
          messageId: 'parentModuleImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Bar/Baz/index.ts'),
      name: '/Bar/Baz cannot export from /Bar because /Bar is a parent of /Baz',
    },
    {
      code: `export * from '@/Bar'`,
      errors: [
        {
          data: {
            currentModule: '/Bar/Baz',
            parentModule: '/Bar',
          },
          messageId: 'parentModuleImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Bar/Baz/index.ts'),
      name: '/Bar/Baz cannot export from /Bar because /Bar is a parent of /Baz (namespace)',
    },
    {
      code: `import { Baz } from '@/Bar/Baz'`,
      errors: [
        {
          data: {
            privatePath: '/index.ts',
            targetModule: '/Bar',
          },
          messageId: 'privateModuleImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      name: '/Foo cannot import /Bar/Baz because /Bar is a module',
      output: `import { Baz } from '@/Bar'`,
    },
    {
      code: `import { Baz } from '@/Bar/Baz'`,
      errors: [
        {
          data: {
            privatePath: '/index.ts',
            targetModule: '/Bar',
          },
          messageId: 'privateModuleImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      name: '/Foo cannot import /Bar/Baz because /Bar is a module (includeModules)',
      options: [
        {
          includeModules: [
            path.resolve(fixturesPath, './Bar/index.ts'),
            path.resolve(fixturesPath, './Bar/Baz/index.ts'),
            path.resolve(fixturesPath, './Foo/index.ts'),
          ],
        },
      ],
      output: `import { Baz } from '@/Bar'`,
    },
    {
      code: `import { barUtility } from '@/Bar/utilities'`,
      errors: [
        {
          data: {
            privatePath: '/utilities.ts',
            targetModule: '/Bar',
          },
          messageId: 'privateModuleImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      name: 'does not correct import if export cannot be resolved from the entry',
    },
    {
      code: `import { Baz } from './index'`,
      errors: [
        {
          messageId: 'indexImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Bar/utilities.ts'),
      name: 'members of virtual module cannot import module index',
      output: `import { Baz } from './Baz'`,
    },
  ],
  valid: [
    {
      code: `import { Bar } from '@/Bar'`,
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      name: '/Foo can import /Bar',
    },
    {
      code: `import { barUtility } from './utilities'`,
      filename: path.resolve(fixturesPath, './Bar/index.ts'),
      name: 'VM index can import from within the VM',
    },
    {
      code: `import { barRoutine } from './routines'`,
      filename: path.resolve(fixturesPath, './Bar/index.ts'),
      name: 'VM index can import from within the VM (JavaScript)',
    },
    {
      code: `import { ESLint } from 'eslint'`,
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      name: 'VM can import another a node_modules package',
    },
    {
      code: `import { Baz } from '@/Bar/Baz'`,
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      options: [
        {
          includeModules: [
            path.resolve(fixturesPath, './Bar/Baz/index.ts'),
            path.resolve(fixturesPath, './Foo/index.ts'),
          ],
        },
      ],
    },
  ],
});
