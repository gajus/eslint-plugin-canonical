import rule from '../../src/rules/filenameNoIndex';
import { RuleTester } from '../RuleTester';

const testCode = "var foo = 'bar';";

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('filename-no-index', rule, {
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
      filename: '/some/dir/index.js',
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
      filename: '/some/dir/foo.js',
    },
  ],
});
