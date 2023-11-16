import rule from '../../src/rules/noRestrictedStrings';
import { createRuleTester } from '../RuleTester';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export default createRuleTester(
  'no-restricted-strings',
  rule,
  { parser: '@typescript-eslint/parser' },
  {
    invalid: [
      {
        code: 'var foo = "bar"',
        errors: [
          {
            messageId: 'disallowedString',
            type: AST_NODE_TYPES.Literal,
          },
        ],
        options: [['bar']],
      },
      {
        // eslint-disable-next-line no-template-curly-in-string
        code: 'const foo = `bar ${baz}`;',
        errors: [
          {
            messageId: 'disallowedStringInTemplate',
            type: AST_NODE_TYPES.TemplateElement,
          },
        ],
        options: [['bar']],
      },
    ],
    valid: [
      {
        code: 'const foo = "bar";',
      },
    ],
  },
);
