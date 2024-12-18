import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/sortReactDependencies';
import { createRuleTester } from '../factories/createRuleTester';

export default createRuleTester(
  'sort-react-dependencies',
  rule,
  { languageOptions: { parser: typescriptEslintParser } },
  {
    invalid: [
      {
        code: 'useEffect(() => {}, [b, a])',
        errors: [
          {
            messageId: 'sort',
          },
        ],
        output: 'useEffect(() => {}, [a, b])',
      },
    ],
    valid: [
      {
        code: 'useEffect(() => {}, [a, b])',
      },
    ],
  },
);
