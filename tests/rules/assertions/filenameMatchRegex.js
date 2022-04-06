const exportingCode = 'module.exports = foo';
const exportedFunctionCall = 'module.exports = foo()';
const testCode = 'var foo = \'bar\';';

export default {
  invalid: [
    {
      code: testCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: 'Filename \'foo_bar.js\' does not match the naming convention.',
        },
      ],
      filename: '/some/dir/foo_bar.js',
    },
    {
      code: testCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: 'Filename \'fooBAR.js\' does not match the naming convention.',
        },
      ],
      filename: '/some/dir/fooBAR.js',
    },
    {
      code: testCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: 'Filename \'fooBar$.js\' does not match the naming convention.',
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
          message: 'Filename \'fooBar.js\' does not match the naming convention.',
        },
      ],
      filename: 'fooBar.js',
      options: [
        '^[a-z_]$',
      ],
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
      options: [
        '^[a-z_]+$',
      ],
    },
    {
      code: testCode,
      filename: '/foo/dir/foo_bar.js',
      options: [
        '^[a-z_]+$',
      ],
    },
    {
      code: testCode,
      filename: '/foo/dir/fooBar.js',
    },
    {
      code: exportingCode,
      filename: 'foo_bar.js',
      options: [
        null,
        true,
      ],
    },
    {
      code: exportingCode,
      filename: 'fooBar.js',
      options: [
        '^[a-z_]$',
        true,
      ],
    },
    {
      code: exportedFunctionCall,
      filename: 'foo_bar.js',
      options: [
        '^[a-z_]+$',
        true,
      ],
    },
  ],
};
