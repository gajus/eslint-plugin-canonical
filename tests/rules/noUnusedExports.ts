import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../../src/rules/noUnusedExports';

const fixturesPath = path.resolve(__dirname, '../fixtures/noUnusedExports');

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no-unused-exports', rule, {
  invalid: [
    {
      code: readFileSync(path.resolve(fixturesPath, 'unusedFoo.ts'), 'utf8'),
      errors: [
        {
          messageId: 'unusedExport',
        },
      ],
      filename: path.resolve(fixturesPath, 'unusedFoo.ts'),
      options: [
        {
          tsConfigPath: path.resolve(fixturesPath, 'tsconfig.json'),
        },
      ],
    },
  ],
  valid: [
    {
      code: readFileSync(path.resolve(fixturesPath, 'usedBar.ts'), 'utf8'),
      filename: path.resolve(fixturesPath, 'usedBar.ts'),
      options: [
        {
          tsConfigPath: path.resolve(fixturesPath, 'tsconfig.json'),
        },
      ],
    },
  ],
});
