import { readFileSync } from 'node:fs';
import path from 'node:path';
import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/noUnusedExports';
import { createRuleTester } from '../RuleTester';

const fixturesPath = path.resolve(__dirname, '../fixtures/noUnusedExports');

export default createRuleTester(
  'no-unused-exports',
  rule,
  { languageOptions: { parser: typescriptEslintParser } },
  {
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
  },
);
