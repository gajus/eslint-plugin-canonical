import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../../src/rules/requireExtension';

const fixturesPath = path.resolve(__dirname, '../fixtures');

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

const invalidTest = (name: string) => {
  return {
    code: readFileSync(
      path.resolve(fixturesPath, `requireExtension/${name}/subject.ts`),
      'utf8',
    ),
    errors: [
      {
        messageId: 'extensionMissing',
      },
    ],
    filename: path.resolve(fixturesPath, `requireExtension/${name}/subject.ts`),
    output: readFileSync(
      path.resolve(fixturesPath, `requireExtension/${name}/subject-fixed.ts`),
      'utf8',
    ),
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(
            fixturesPath,
            `requireExtension/${name}/tsconfig.json`,
          ),
        },
      },
    },
  } as const;
};

const validTest = (name: string) => {
  return {
    code: readFileSync(
      path.resolve(
        fixturesPath,

        `requireExtension/${name}/subject.ts`,
      ),
      'utf8',
    ),
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(
            fixturesPath,
            `requireExtension/${name}/subject.ts`,
          ),
        },
      },
    },
  } as const;
};

ruleTester.run('require-extension', rule, {
  invalid: [
    invalidTest('relativeImport'),
    invalidTest('relativeImportWithIndex'),
    invalidTest('pathsImport'),
    invalidTest('pathsImportWithIndex'),
    invalidTest('pathsImportWithIndex'),
  ],
  valid: [
    validTest('relativeImportWithExtension'),
    validTest('pathsImportWithExtension'),
  ],
});
