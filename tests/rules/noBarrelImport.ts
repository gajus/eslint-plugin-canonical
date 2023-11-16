import rule from '../../src/rules/noBarrelImport';
import { createRuleTester } from '../RuleTester';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const fixturesPath = path.resolve(__dirname, '../fixtures');

const invalidTest = (name: string, only: boolean = false) => {
  return {
    code: readFileSync(
      path.resolve(fixturesPath, `noBarrelImport/invalid/${name}/subject.ts`),
      'utf8',
    ),
    errors: [
      {
        messageId: 'noBarrelImport',
      },
    ],
    filename: path.resolve(
      fixturesPath,
      `noBarrelImport/invalid/${name}/subject.ts`,
    ),
    name,
    only,
    output: readFileSync(
      path.resolve(
        fixturesPath,
        `noBarrelImport/invalid/${name}/subject-fixed.ts`,
      ),
      'utf8',
    ),
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: path.resolve(
            fixturesPath,
            `noBarrelImport/invalid/${name}/tsconfig.json`,
          ),
        },
      },
    },
  } as const;
};

const validTest = (name: string, only: boolean = false) => {
  return {
    code: readFileSync(
      path.resolve(fixturesPath, `noBarrelImport/valid/${name}/subject.ts`),
      'utf8',
    ),
    filename: path.resolve(
      fixturesPath,
      `noBarrelImport/valid/${name}/subject.ts`,
    ),
    name,
    only,
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: path.resolve(
            fixturesPath,
            `noBarrelImport/valid/${name}/tsconfig.json`,
          ),
        },
      },
    },
  } as const;
};

export default createRuleTester(
  'no-barrel-import',
  rule,
  {
    parser: '@typescript-eslint/parser',
  },
  {
    invalid: [
      invalidTest('barrelImport'),
      invalidTest('barrelImportAliased'),
      invalidTest('barrelImportAliasedReexport'),
      invalidTest('barrelImportDeep'),
      invalidTest('barrelImportDefault'),
      invalidTest('barrelTypeImport'),
      invalidTest('mixedImport'),
    ],
    valid: [
      validTest('directImport'),
      validTest('directImportDefault'),
      validTest('packageImport'),
    ],
  },
);
