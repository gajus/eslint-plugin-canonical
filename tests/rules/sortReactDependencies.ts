import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/sortReactDependencies';
import { createRuleTester } from '../RuleTester';

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
      {
        code: 'useEffect(() => {}, [a, B])',
        errors: [
          {
            messageId: 'sort',
          },
        ],
        options: [{ caseSensitive: true }],
        output: 'useEffect(() => {}, [B, a])',
      },
    ],
    valid: [
      {
        code: 'useEffect(() => {}, [a, b])',
      },
    ],
  },
);
