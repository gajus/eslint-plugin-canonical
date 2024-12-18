import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/filenameMatchRegex';
import { createRuleTester } from '../factories/createRuleTester';

const exportingCode = 'module.exports = foo';
const exportedFunctionCall = 'module.exports = foo()';
const testCode = "var foo = 'bar';";

export default createRuleTester(
  'filename-match-regex',
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
            messageId: 'notMatch',
          },
        ],
        filename: './some/dir/foo_bar.js',
      },
      {
        code: testCode,
        errors: [
          {
            column: 1,
            line: 1,
            messageId: 'notMatch',
          },
        ],
        filename: './some/dir/fooBAR.js',
      },
      {
        code: testCode,
        errors: [
          {
            column: 1,
            line: 1,
            messageId: 'notMatch',
          },
        ],
        filename: 'fooBar$.js',
      },
      {
        code: testCode,
        errors: [
          {
            column: 1,
            line: 1,
            messageId: 'notMatch',
          },
        ],
        filename: 'fooBar.js',
        options: [{ regex: '^[a-z_]$' }],
      },
    ],

    valid: [
      {
        code: testCode,
        filename: 'foobar.js',
      },
      {
        code: testCode,
        filename: 'fooBar.js',
      },
      {
        code: testCode,
        filename: 'foo1Bar1.js',
      },
      {
        code: testCode,
        filename: 'foo_bar.js',
        options: [{ regex: '^[a-z_]+$' }],
      },
      {
        code: testCode,
        filename: './foo/dir/foo_bar.js',
        options: [{ regex: '^[a-z_]+$' }],
      },
      {
        code: testCode,
        filename: './foo/dir/fooBar.js',
      },
      {
        code: exportingCode,
        filename: 'foo_bar.js',
        options: [{ ignoreExporting: true }],
      },
      {
        code: exportingCode,
        filename: 'fooBar.js',
        options: [{ ignoreExporting: true, regex: '^[a-z_]$' }],
      },
      {
        code: exportedFunctionCall,
        filename: 'foo_bar.js',
        options: [{ ignoreExporting: true, regex: '^[a-z_]+$' }],
      },
    ],
  },
);
