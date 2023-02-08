import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';
import rule from '../../src/rules/noRestrictedStrings';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no-restricted-strings', rule, {
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
});
