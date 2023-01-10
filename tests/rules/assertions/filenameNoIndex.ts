const testCode = "var foo = 'bar';";

export default {
  invalid: [
    {
      code: testCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "'index.js' files are not allowed.",
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
          message: "'index.js' files are not allowed.",
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
};
