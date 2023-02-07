import { readFileSync } from 'node:fs';
import path from 'node:path';

const fixturesPath = path.resolve(__dirname, '../../fixtures/noUnusedExports');

export default {
  invalid: [
    {
      code: readFileSync(path.resolve(fixturesPath, 'unusedFoo.ts'), 'utf8'),
      errors: [
        {
          message: "Export 'FOO' is unused.",
        },
      ],
      filename: path.resolve(fixturesPath, 'unusedFoo.ts'),
      options: [
        {
          tsConfigPath: path.resolve(fixturesPath, 'tsconfig.json'),
        },
      ],
    },
  ],
  valid: [
    {
      code: readFileSync(path.resolve(fixturesPath, 'usedBar.ts'), 'utf8'),
      filename: path.resolve(fixturesPath, 'usedBar.ts'),
      options: [
        {
          tsConfigPath: path.resolve(fixturesPath, 'tsconfig.json'),
        },
      ],
    },
  ],
};
