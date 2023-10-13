import { readFileSync } from 'node:fs';
import path from 'node:path';
import rule from '../../src/rules/preferReactLazy';
import { createRuleTester } from '../RuleTester';

const fixturesPath = path.resolve(__dirname, '../fixtures');

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
      invalidTest('jsxConditionalExpression'),
      invalidTest('nestedJsxConditionalExpression'),
      invalidTest('returnConditionalExpression'),
    ],
    valid: [validTest('dynamicImport')],
  },
);
