import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';
import rule from '../../src/rules/exportSpecifierNewline';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('export-specifier-newline', rule, {
  invalid: [
    {
      code: 'const a = 1; const b = 2; const c = 3; export { a, b, c };',
      errors: [
        {
          messageId: 'specifiersOnNewline',
          type: AST_NODE_TYPES.ExportNamedDeclaration,
        },
        {
          messageId: 'specifiersOnNewline',
          type: AST_NODE_TYPES.ExportNamedDeclaration,
        },
      ],
      output: 'const a = 1; const b = 2; const c = 3; export { a,\nb,\nc };',
    },
    {
      code: 'const a = 1; const b = 2; const c = 3; export { a, b, c, };',
      errors: [
        {
          messageId: 'specifiersOnNewline',
          type: AST_NODE_TYPES.ExportNamedDeclaration,
        },
        {
          messageId: 'specifiersOnNewline',
          type: AST_NODE_TYPES.ExportNamedDeclaration,
        },
      ],
      output: 'const a = 1; const b = 2; const c = 3; export { a,\nb,\nc, };',
    },
    {
      code: 'const a = 1; const b = 2; export { a as default, b }',
      errors: [
        {
          messageId: 'specifiersOnNewline',
          type: AST_NODE_TYPES.ExportNamedDeclaration,
        },
      ],
      output: 'const a = 1; const b = 2; export { a as default,\nb }',
    },
  ],
  valid: [
    {
      code: "export { \n a,\nb,\nc\n } from 'foo'",
    },
    {
      code: 'const a = 1; const b = 2; const c = 3; export { \n a,\nb,\nc\n };',
    },
    {
      code: "export * from 'foo'",
    },
  ],
});
