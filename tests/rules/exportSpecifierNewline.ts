import {parser as typescriptEslintParser} from 'typescript-eslint';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import rule from '../../src/rules/exportSpecifierNewline';
import { createRuleTester } from '../factories/createRuleTester';

export default createRuleTester(
  'export-specifier-newline',
  rule,
  {
    languageOptions: {
      parser: typescriptEslintParser,
    },
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
