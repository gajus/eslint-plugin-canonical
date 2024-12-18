import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/filenameNoIndex';
import { createRuleTester } from '../factories/createRuleTester';

const testCode = "var foo = 'bar';";

export default createRuleTester(
  'filename-no-index',
  rule,
  {
    languageOptions: { parser: typescriptEslintParser },
  },
  {
    invalid: [
      {
        code: testCode,
        errors: [
          {
            column: 1,
            line: 1,
            messageId: 'noIndex',
          },
        ],
        filename: 'index.js',
      },
      {
        code: testCode,
        errors: [
          {
            column: 1,
            line: 1,
            messageId: 'noIndex',
          },
        ],
        filename: './some/dir/index.js',
      },
    ],
    valid: [
      {
        code: testCode,
        filename: '<text>',
      },
      {
        code: testCode,
        filename: '<input>',
      },
      {
        code: testCode,
        filename: 'foo.js',
      },
      {
        code: testCode,
        filename: './some/dir/foo.js',
      },
    ],
  },
);
