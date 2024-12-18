import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/noImportNamespaceDestructure';
import { createRuleTester } from '../factories/createRuleTester';

export default createRuleTester(
  'no-import-namespace-destructure',
  rule,
  { languageOptions: { parser: typescriptEslintParser } },
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
