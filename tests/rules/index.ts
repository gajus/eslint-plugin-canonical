import assert from 'node:assert';
import Ajv from 'ajv';
import { RuleTester } from 'eslint';
import { camelCase } from 'lodash';
import plugin from '../../src';

const ruleTester = new RuleTester({
  parserOptions: {
    requireConfigFile: false,
  },
});

const reportingRules = [
  // 'destructuring-property-newline',
  // 'export-specifier-newline',
  // 'filename-match-exported',
  // 'filename-match-regex',
  // 'filename-no-index',
  // 'id-match',
  // 'import-specifier-newline',
  // 'no-restricted-strings',
  // 'no-unused-exports',
  // 'no-use-extend-native',
  // 'prefer-import-alias',
  // 'prefer-inline-type-import',
  // 'prefer-use-mount',
  // 'sort-keys',
  'virtual-module',
];

const parser = require.resolve('@typescript-eslint/parser');

const ajv = new Ajv({
  verbose: true,
});

for (const ruleName of reportingRules) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const assertions = require('./assertions/' + camelCase(ruleName)).default;

  if (assertions.misconfigured) {
    for (const misconfiguration of assertions.misconfigured) {
      RuleTester.describe(ruleName, () => {
        RuleTester.describe('misconfigured', () => {
          RuleTester.it(JSON.stringify(misconfiguration.options), () => {
            const schema =
              plugin.rules[ruleName].schema && plugin.rules[ruleName].schema;

            if (!schema) {
              throw new Error('No schema.');
            }

            const validateSchema = ajv.compile({
              items: schema,
              type: 'array',
            });

            validateSchema(misconfiguration.options);

            if (!validateSchema.errors) {
              throw new Error('Schema was valid.');
            }

            assert.deepStrictEqual(
              validateSchema.errors,
              misconfiguration.errors,
            );
          });
        });
      });
    }
  }

  assertions.invalid = assertions.invalid.map((assertion) => {
    assertion.parser = parser;

    return assertion;
  });

  assertions.valid = assertions.valid.map((assertion) => {
    assertion.parser = parser;

    return assertion;
  });

  ruleTester.run(ruleName, plugin.rules[ruleName], assertions);
}
