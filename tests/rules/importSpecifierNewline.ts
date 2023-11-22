import rule from '../../src/rules/importSpecifierNewline';
import { createRuleTester } from '../RuleTester';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export default createRuleTester(
  'import-specifier-newline',
  rule,
  {
    parser: '@typescript-eslint/parser',
  },
  {
    invalid: [
      {
        code: "import {a, b} from 'foo';",
        errors: [
          {
            messageId: 'specifiersOnNewline',
            type: AST_NODE_TYPES.ImportDeclaration,
          },
        ],
        output: "import {a,\nb} from 'foo';",
      },
      {
        code: "import a, {b, c} from 'foo';",
        errors: [
          {
            messageId: 'specifiersOnNewline',
            type: AST_NODE_TYPES.ImportDeclaration,
          },
        ],
        output: "import a, {b,\nc} from 'foo';",
      },
    ],
    valid: [
      {
        code: "import {a,\nb} from 'foo'",
      },
      {
        code: "import a, {b,\nc} from 'foo'",
      },
    ],
  },
);
