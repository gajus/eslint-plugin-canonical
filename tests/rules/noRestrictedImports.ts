import {parser as typescriptEslintParser} from 'typescript-eslint';
import rule from '../../src/rules/noRestrictedImports';
import { createRuleTester } from '../factories/createRuleTester';

export default createRuleTester(
  'no-restricted-imports',
  rule,
  { languageOptions: { parser: typescriptEslintParser } },
  {
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
                importName: '*',
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
                importName: 'foo',
                message: 'foo is restricted',
                name: 'bar',
              },
            ],
          },
        ],
      },
      {
        code: `import { default as bar } from 'bar'`,
        errors: [
          {
            data: {
              customMessage: 'foo is restricted',
              importName: 'default',
              importSource: 'bar',
            },
            messageId: 'importName',
          },
        ],
        options: [
          {
            paths: [
              {
                importName: 'default',
                message: 'foo is restricted',
                name: 'bar',
              },
            ],
          },
        ],
      },
      {
        code: `import bar from 'bar'`,
        errors: [
          {
            data: {
              customMessage: 'foo is restricted',
              importSource: 'bar',
            },
            messageId: 'path',
          },
        ],
        options: [
          {
            paths: [
              {
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
                importName: 'foo',
                message: 'foo is restricted',
                name: 'bar',
              },
            ],
          },
        ],
      },
    ],
  },
);
