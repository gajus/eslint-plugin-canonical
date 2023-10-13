import rule from '../../src/rules/preferUseMount';
import { createRuleTester } from '../RuleTester';

export default createRuleTester(
  'prefer-use-mount',
  rule,
  {
    parser: '@typescript-eslint/parser',
  },
  {
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
  },
);
