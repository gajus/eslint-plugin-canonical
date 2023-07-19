import { readFileSync } from 'node:fs';
import path from 'node:path';
import rule from '../../src/rules/noReassignImports';
import { RuleTester } from '../RuleTester';

const fixturesPath = path.resolve(__dirname, '../fixtures');

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

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

ruleTester.run('prefer-react-lazy', rule, {
  invalid: [
    invalidTest('namedImportNamedExport'),
    invalidTest('namedImportDefaultExport'),
  ],
  valid: [],
});
