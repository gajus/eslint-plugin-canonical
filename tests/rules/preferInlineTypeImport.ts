import rule from '../../src/rules/preferInlineTypeImport';
import { createRuleTester } from '../RuleTester';

export default createRuleTester(
  'prefer-inline-type-import',
  rule,
  {
    parser: '@typescript-eslint/parser',
  },
  {
    invalid: [
      {
        code: "import type {foo} from 'bar'",
        errors: [
          {
            messageId: 'noTypeImport',
          },
        ],
        output: "import {type foo} from 'bar'",
      },
      {
        code: "import type {foo, baz} from 'bar'",
        errors: [
          {
            messageId: 'noTypeImport',
          },
        ],
        output: "import {type foo, type baz} from 'bar'",
      },
    ],
    valid: [
      {
        code: "import {type foo} from 'bar'",
      },
      {
        code: "import type Foo from 'bar'",
      },
      {
        code: "import type * as Foo from 'bar'",
      },
    ],
  },
);
