import { readFileSync } from 'node:fs';
import path from 'node:path';
import rule from '../../src/rules/noReassignImports';
import { createRuleTester } from '../RuleTester';

const fixturesPath = path.resolve(__dirname, '../fixtures');

const invalidTest = (name: string, only: boolean = false) => {
  return {
    code: readFileSync(
      path.resolve(
        fixturesPath,
        `noReassignImports/invalid/${name}/subject.ts`,
      ),
      'utf8',
    ),
    errors: [
      {
        messageId: 'noReassignImports' as const,
      },
    ],
    filename: path.resolve(
      fixturesPath,
      `noReassignImports/invalid/${name}/subject.ts`,
    ),
    name,
    only,
  } as const;
};

export default createRuleTester(
  'prefer-react-lazy',
  rule,
  {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  {
    invalid: [
      invalidTest('namedImportNamedExport'),
      invalidTest('namedImportDefaultExport'),
    ],
    valid: [],
  },
);
