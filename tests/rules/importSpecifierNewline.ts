import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import rule from '../../src/rules/importSpecifierNewline';
import { RuleTester } from '../RuleTester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('import-specifier-newline', rule, {
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
});
