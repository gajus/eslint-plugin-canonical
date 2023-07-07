import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../../src/rules/requireExtension';

const fixturesPath = path.resolve(__dirname, '../fixtures');

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('require-extension', rule, {
  invalid: [
    {
      code: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtension/relativeImport/subject.ts',
        ),
        'utf8',
      ),
      errors: [
        {
          messageId: 'extensionMissing',
        },
      ],
      filename: path.resolve(
        fixturesPath,
        'requireExtension/relativeImport/subject.ts',
      ),
      output: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtension/relativeImport/subject-fixed.ts',
        ),
        'utf8',
      ),
    },
  ],
  valid: [
    {
      code: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtensionRelativeImportWithExtension/subject.ts',
        ),
        'utf8',
      ),
    },
  ],
});
