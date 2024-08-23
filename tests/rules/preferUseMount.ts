import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/preferUseMount';
import { createRuleTester } from '../RuleTester';

export default createRuleTester(
  'prefer-use-mount',
  rule,
  {
    languageOptions: { parser: typescriptEslintParser }
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
