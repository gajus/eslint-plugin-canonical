import rule from '../../src/rules/noRestrictedImports';
import { RuleTester } from '../RuleTester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no-restricted-imports', rule, {
  invalid: [
    {
      code: `import * as bar from 'bar'`,
      errors: [
        {
          data: {
            customMessage: 'foo is restricted',
            importNames: '*',
            importSource: 'bar',
          },
          messageId: 'everything',
        },
      ],
      options: [
        {
          paths: [
            {
              importNames: ['*'],
              message: 'foo is restricted',
              name: 'bar',
            },
          ],
        },
      ],
    },
    {
      code: `import { foo } from 'bar'`,
      errors: [
        {
          data: {
            customMessage: 'foo is restricted',
            importName: 'foo',
            importSource: 'bar',
          },
          messageId: 'importName',
        },
      ],
      options: [
        {
          paths: [
            {
              importNames: ['foo'],
              message: 'foo is restricted',
              name: 'bar',
            },
          ],
        },
      ],
    },
  ],
  valid: [
    {
      code: `import { bar } from 'bar'`,
      options: [
        {
          paths: [
            {
              importNames: ['foo'],
              message: 'foo is restricted',
              name: 'bar',
            },
          ],
        },
      ],
    },
  ],
});
