import rule from '../../src/rules/preferUseMount';
import { RuleTester } from '../RuleTester';

const ruleTester = new RuleTester({
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
