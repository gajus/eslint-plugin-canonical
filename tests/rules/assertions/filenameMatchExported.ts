/* eslint-disable canonical/id-match */

const testCode = "var foo = 'bar';";
const testCallCode = 'export default foo();';
const exportedVariableCode = 'module.exports = exported;';
const exportedJsxClassCode =
  'module.exports = class Foo { render() { return <span>Test Class</span>; } };';
const exportedClassCode = 'module.exports = class Foo {};';
const exportedFunctionCode = 'module.exports = function foo() {};';
const exportUnnamedFunctionCode = 'module.exports = function() {};';
const exportedCalledFunctionCode = 'module.exports = foo();';
const exportedJsxFunctionCode =
  'module.exports = function foo() { return <span>Test Fn</span> };';
const exportedEs6VariableCode = 'export default exported;';
const exportedEs6ClassCode = 'export default class Foo {};';
const exportedEs6JsxClassCode =
  'export default class Foo { render() { return <span>Test Class</span>; } };';
const exportedEs6FunctionCode = 'export default function foo() {};';
const exportedEs6JsxFunctionCode =
  'export default function foo() { return <span>Test Fn</span> };';
const exportedEs6Index = 'export default function index() {};';
const camelCaseCommonJS = 'module.exports = variableName;';
const snakeCaseCommonJS = 'module.exports = variable_name;';
const camelCaseEs6 = 'export default variableName;';
const snakeCaseEs6 = 'export default variable_name;';

export default {
  invalid: [
    {
      code: exportedVariableCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'fooBar' must match the exported name 'exported'.",
        },
      ],
      filename: '/some/dir/fooBar.js',
    },
    {
      code: exportedClassCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'foo' must match the exported name 'Foo'.",
        },
      ],
      filename: '/some/dir/foo.js',
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: exportedJsxClassCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'foo' must match the exported name 'Foo'.",
        },
      ],
      filename: '/some/dir/foo.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
      },
    },
    {
      code: exportedFunctionCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'bar' must match the exported name 'foo'.",
        },
      ],
      filename: '/some/dir/bar.js',
    },
    {
      code: exportedJsxFunctionCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'bar' must match the exported name 'foo'.",
        },
      ],
      filename: '/some/dir/bar.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    {
      code: exportedEs6VariableCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'fooBar' must match the exported name 'exported'.",
        },
      ],
      filename: '/some/dir/fooBar.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6ClassCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'bar' must match the exported name 'Foo'.",
        },
      ],
      filename: '/some/dir/bar.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6JsxClassCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'bar' must match the exported name 'Foo'.",
        },
      ],
      filename: '/some/dir/bar.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6FunctionCode,
      errors: [
        {
          column: 1,
          line: 1,
          message:
            "The directory 'fooBar' must be named 'foo', after the exported value of its index file.",
        },
      ],
      filename: '/some/dir/fooBar/index.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },

    {
      code: exportedEs6JsxFunctionCode,
      errors: [
        {
          column: 1,
          line: 1,
          message:
            "The directory 'fooBar' must be named 'foo', after the exported value of its index file.",
        },
      ],
      filename: '/some/dir/fooBar/index.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedVariableCode,
      errors: [
        {
          column: 1,
          line: 1,
          message:
            "The directory 'eslint-plugin-canonical' must be named 'exported', after the exported value of its index file.",
        },
      ],
      filename: 'index.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedJsxClassCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'Foo.react' must match the exported name 'Foo'.",
        },
      ],
      filename: '/some/dir/Foo.react.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
      },
    },
    {
      code: camelCaseCommonJS,
      errors: [
        {
          column: 1,
          line: 1,
          message:
            "Filename 'variableName' must match the exported and transformed name 'variable_name'.",
        },
      ],
      filename: 'variableName.js',
      options: ['snake'],
    },
    {
      code: camelCaseEs6,
      errors: [
        {
          column: 1,
          line: 1,
          message:
            "Filename 'variableName' must match the exported and transformed name 'variable-name'.",
        },
      ],
      filename: 'variableName.js',
      options: ['kebab'],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: camelCaseEs6,
      errors: [
        {
          column: 1,
          line: 1,
          message:
            "Filename 'variableName' must match the exported and transformed name 'VariableName'.",
        },
      ],
      filename: 'variableName.js',
      options: ['pascal'],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: camelCaseEs6,
      errors: [
        {
          column: 1,
          line: 1,
          message:
            "Filename 'variableName' must match any of the exported and transformed names 'VariableName', 'variable_name'.",
        },
      ],
      filename: 'variableName.js',
      options: [['pascal', 'snake']],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6JsxClassCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'Foo.bar' must match the exported name 'Foo'.",
        },
      ],
      filename: '/some/dir/Foo.bar.js',
      options: [null, '\\.react$'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6JsxClassCode,
      errors: [
        {
          column: 1,
          line: 1,
          message:
            "The directory 'Foo.react' must be named 'Foo', after the exported value of its index file.",
        },
      ],
      filename: '/some/dir/Foo.react/index.js',
      options: [null, '\\.react$'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedCalledFunctionCode,
      errors: [
        {
          column: 1,
          line: 1,
          message: "Filename 'bar' must match the exported name 'foo'.",
        },
      ],
      filename: '/some/dir/bar.js',
      options: [null, null, true],
    },
  ],

  valid: [
    {
      code: exportUnnamedFunctionCode,
      filename: 'testFile.js',
    },
    {
      code: testCode,
      filename: '/some/dir/exported.js',
    },
    {
      code: testCallCode,
      filename: '/some/dir/foo.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedVariableCode,
      filename: '/some/dir/exported.js',
    },
    {
      code: exportedClassCode,
      filename: '/some/dir/Foo.js',
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: exportedJsxClassCode,
      filename: '/some/dir/Foo.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
      },
    },
    {
      code: exportedFunctionCode,
      filename: '/some/dir/foo.js',
    },
    {
      code: exportedCalledFunctionCode,
      filename: '/some/dir/bar.js',
    },
    {
      code: exportedJsxFunctionCode,
      filename: '/some/dir/foo.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    {
      code: exportedEs6VariableCode,
      filename: '/some/dir/exported.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6ClassCode,
      filename: '/some/dir/Foo.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6JsxClassCode,
      filename: '/some/dir/Foo.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6FunctionCode,
      filename: '/some/dir/foo.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },

    {
      code: exportedEs6JsxFunctionCode,
      filename: '/some/dir/foo.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedEs6FunctionCode,
      filename: '/some/dir/foo/index.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },

    {
      code: exportedEs6JsxFunctionCode,
      filename: '/some/dir/foo/index.js',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },

    {
      code: exportedEs6Index,

      // /foo is used as cwd for test setup so full path will be /foo/index.js
      filename: 'index.js',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: camelCaseCommonJS,
      filename: 'variable_name.js',
      options: ['snake'],
    },
    {
      code: camelCaseCommonJS,
      filename: 'variable_name/index.js',
      options: ['snake'],
    },
    {
      code: camelCaseCommonJS,
      filename: 'variable-name.js',
      options: ['kebab'],
    },
    {
      code: snakeCaseCommonJS,
      filename: 'variableName.js',
      options: ['camel'],
    },
    {
      code: camelCaseEs6,
      filename: 'variable_name.js',
      options: ['snake'],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: camelCaseEs6,
      filename: 'variable-name.js',
      options: ['kebab'],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: snakeCaseEs6,
      filename: 'variableName.js',
      options: ['camel'],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: snakeCaseEs6,
      filename: 'VariableName.js',
      options: ['pascal'],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: snakeCaseEs6,
      filename: 'variableName.js',
      options: [['pascal', 'camel']],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: snakeCaseEs6,
      filename: 'VariableName.js',
      options: [['pascal', 'camel']],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedJsxClassCode,
      filename: '/some/dir/Foo.react.js',
      options: [null, '\\.react$'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
      },
    },
    {
      code: exportedEs6JsxClassCode,
      filename: '/some/dir/Foo.react.js',
      options: [null, '\\.react$'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: exportedCalledFunctionCode,
      filename: '/some/dir/foo.js',
      options: [null, null, true],
    },
  ],
};
