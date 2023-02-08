import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../../src/rules/preferUseMount';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('prefer-use-mount', rule, {
  invalid: [
    {
      code: 'useEffect(() => {}, [])',
      errors: [
        {
          messageId: 'noEffectWithoutDependencies',
        },
      ],
    },
  ],
  valid: [
    {
      code: 'useEffect(() => {}, [foo])',
    },
    {
      code: 'useMount(() => {}, [])',
    },
  ],
});
