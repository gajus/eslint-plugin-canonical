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
          messageId: 'privateModuleImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      name: '/Foo cannot import /Bar/Baz because /Bar is a module',
    },
    {
      code: `import { Bar } from './index'`,
      errors: [
        {
          messageId: 'indexImport',
        },
      ],
      filename: path.resolve(fixturesPath, './Bar/utilities.ts'),
      name: 'members of virtual module cannot import module index',
    },
  ],
  valid: [
    {
      code: `import { Bar } from '@/Bar'`,
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      name: '/Foo can import /Bar',
    },
    {
      code: `import { bar } from './utilities'`,
      filename: path.resolve(fixturesPath, './Bar/index.ts'),
      name: 'VM index can import from within the VM',
    },
    {
      code: `import { bar } from './routines'`,
      filename: path.resolve(fixturesPath, './Bar/index.ts'),
      name: 'VM index can import from within the VM (JavaScript)',
    },
    {
      code: `import { ESLint } from 'eslint'`,
      filename: path.resolve(fixturesPath, './Foo/index.ts'),
      name: 'VM can import another a node_modules package',
    },
  ],
});
