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
    {
      code: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtension/relativeImportWithIndex/subject.ts',
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
        'requireExtension/relativeImportWithIndex/subject.ts',
      ),
      output: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtension/relativeImportWithIndex/subject-fixed.ts',
        ),
        'utf8',
      ),
    },
    {
      code: readFileSync(
        path.resolve(fixturesPath, 'requireExtension/pathsImport/subject.ts'),
        'utf8',
      ),
      errors: [
        {
          messageId: 'extensionMissing',
        },
      ],
      filename: path.resolve(
        fixturesPath,
        'requireExtension/pathsImport/subject.ts',
      ),
      output: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtension/pathsImport/subject-fixed.ts',
        ),
        'utf8',
      ),
      settings: {
        'import/resolver': {
          typescript: {
            project: path.resolve(
              fixturesPath,
              'requireExtension/pathsImport/tsconfig.json',
            ),
          },
        },
      },
    },
    {
      code: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtension/pathsImportWithIndex/subject.ts',
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
        'requireExtension/pathsImportWithIndex/subject.ts',
      ),
      output: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtension/pathsImportWithIndex/subject-fixed.ts',
        ),
        'utf8',
      ),
      settings: {
        'import/resolver': {
          typescript: {
            project: path.resolve(
              fixturesPath,
              'requireExtension/pathsImportWithIndex/tsconfig.json',
            ),
          },
        },
      },
    },
  ],
  valid: [
    {
      code: readFileSync(
        path.resolve(
          fixturesPath,
          'requireExtension/relativeImportWithExtension/subject.ts',
        ),
        'utf8',
      ),
    },
    {
      code: readFileSync(
        path.resolve(
          fixturesPath,

          'requireExtension/pathsImportWithExtension/subject.ts',
        ),
        'utf8',
      ),
      settings: {
        'import/resolver': {
          typescript: {
            project: path.resolve(
              fixturesPath,
              'requireExtension/pathsImportWithExtension/tsconfig.json',
            ),
          },
        },
      },
    },
  ],
});
