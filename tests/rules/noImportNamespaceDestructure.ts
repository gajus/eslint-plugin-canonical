import rule from '../../src/rules/noImportNamespaceDestructure';
import { createRuleTester } from '../RuleTester';

export default createRuleTester(
  'no-import-namespace-destructure',
  rule,
  { parser: '@typescript-eslint/parser' },
  {
    invalid: [
      {
        code: `import * as bar from 'bar'; const { foo } = bar;`,
        errors: [
          {
            messageId: 'noDestructureNamespace',
          },
        ],
      },
    ],
    valid: [
      {
        code: `import * as bar from 'bar'`,
      },
    ],
  },
);
