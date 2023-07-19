import { readFileSync } from 'node:fs';
import path from 'node:path';
import rule from '../../src/rules/preferReactLazy';
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
      path.resolve(fixturesPath, `preferReactLazy/invalid/${name}/subject.tsx`),
      'utf8',
    ),
    errors: [
      {
        messageId: 'preferReactLazy' as const,
      },
    ],
    filename: path.resolve(
      fixturesPath,
      `preferReactLazy/invalid/${name}/subject.tsx`,
    ),
    name,
    only,
  } as const;
};

const validTest = (name: string, only: boolean = false) => {
  return {
    code: readFileSync(
      path.resolve(fixturesPath, `preferReactLazy/valid/${name}/subject.tsx`),
      'utf8',
    ),
    filename: path.resolve(
      fixturesPath,
      `preferReactLazy/valid/${name}/subject.tsx`,
    ),
    name,
    only,
  } as const;
};

ruleTester.run('prefer-react-lazy', rule, {
  invalid: [
    invalidTest('jsxConditionalExpression'),
    invalidTest('nestedJsxConditionalExpression'),
    invalidTest('returnConditionalExpression'),
  ],
  valid: [validTest('dynamicImport')],
});
