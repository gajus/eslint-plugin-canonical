import { readFileSync } from 'node:fs';
import path from 'node:path';
import rule from '../../src/rules/noExportAll';
import { createRuleTester } from '../RuleTester';

const fixturesPath = path.resolve(__dirname, '../fixtures');

const invalidTest = (name: string, only: boolean = false) => {
  return {
    code: readFileSync(
      path.resolve(fixturesPath, `noExportAll/invalid/${name}/subject.ts`),
      'utf8',
    ),
    errors: [
      {
        messageId: 'noExportAll',
      },
    ],
    filename: path.resolve(
      fixturesPath,
      `noExportAll/invalid/${name}/subject.ts`,
    ),
    name,
    only,
    output: readFileSync(
      path.resolve(
        fixturesPath,
        `noExportAll/invalid/${name}/subject-fixed.ts`,
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
            `noExportAll/invalid/${name}/tsconfig.json`,
          ),
        },
      },
    },
  } as const;
};

const validTest = (name: string, only: boolean = false) => {
  return {
    code: readFileSync(
      path.resolve(fixturesPath, `noExportAll/valid/${name}/subject.ts`),
      'utf8',
    ),
    filename: path.resolve(
      fixturesPath,
      `noExportAll/valid/${name}/subject.ts`,
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
            `noExportAll/valid/${name}/tsconfig.json`,
          ),
        },
      },
    },
  } as const;
};

export default createRuleTester(
  'no-export-all',
  rule,
  {
    parser: '@typescript-eslint/parser',
  },
  {
    invalid: [invalidTest('namespaceExport'), invalidTest('reExport')],
    valid: [validTest('namedExport'), validTest('aliasedReExport')],
  },
);
