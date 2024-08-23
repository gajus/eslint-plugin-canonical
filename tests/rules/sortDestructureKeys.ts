import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/sortDestructureKeys';
import { createRuleTester } from '../RuleTester';

/**
 * @todo Add tests from https://github.com/mthadley/eslint-plugin-sort-destructure-keys/blob/master/tests/lib/rules/sort-destructure-keys.js
 */
export default createRuleTester(
  'sort-destructure-keys',
  rule,
  { languageOptions: { parser: typescriptEslintParser } },
  {
    invalid: [
      {
        code: 'const {b, a} = foo',
        errors: [
          {
            data: { first: 'a', second: 'b' },
            messageId: 'sort',
            type: AST_NODE_TYPES.Property,
          },
        ],
        output: 'const {a, b} = foo',
      },
      {
        code: 'const {a, B} = foo',
        errors: [
          {
            data: { first: 'B', second: 'a' },
            messageId: 'sort',
            type: AST_NODE_TYPES.Property,
          },
        ],
        options: [{ caseSensitive: true }],
        output: 'const {B, a} = foo',
      },
    ],
    valid: [
      {
        code: 'const {a, b} = foo',
      },
    ],
  },
);
