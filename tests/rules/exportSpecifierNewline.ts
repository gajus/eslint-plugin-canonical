import rule from '../../src/rules/exportSpecifierNewline';
import { createRuleTester } from '../RuleTester';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export default createRuleTester(
  'export-specifier-newline',
  rule,
  {
    parser: '@typescript-eslint/parser',
  },
  {
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
  },
);
