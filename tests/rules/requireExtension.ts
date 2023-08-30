import { readFileSync } from 'node:fs';
import path from 'node:path';
import rule from '../../src/rules/requireExtension';
import { RuleTester } from '../RuleTester';

const fixturesPath = path.resolve(__dirname, '../fixtures');

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

const invalidTest = (name: string, only: boolean = false) => {
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
    only,
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

const validTest = (name: string, only: boolean = false) => {
  return {
    code: readFileSync(
      path.resolve(
        fixturesPath,

        `requireExtension/${name}/subject.ts`,
      ),
      'utf8',
    ),
    filename: path.resolve(fixturesPath, `requireExtension/${name}/subject.ts`),
    only,
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

ruleTester.run('require-extension', rule, {
  invalid: [
    invalidTest('pathsImport'),
    invalidTest('pathsImportWithIndex'),
    invalidTest('pathsImportWithIndex'),
    invalidTest('relativeImport'),
    invalidTest('relativeImportWithIndex'),
    invalidTest('relativeNamedExport'),
  ],
  valid: [
    validTest('pathsImportIgnoreUnknownExtensions'),
    validTest('pathsImportWithExtension'),
    validTest('relativeImportIgnoreUnknownExtensions'),
    validTest('relativeImportWithExtension'),
    validTest('typedPackageImport'),
    validTest('packageTypesImport'),
  ],
});
