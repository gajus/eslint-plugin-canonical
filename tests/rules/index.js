import assert from 'assert';
import Ajv from 'ajv';
import {
  RuleTester,
} from 'eslint';
import {
  camelCase,
} from 'lodash';
import plugin from '../../src';

const ruleTester = new RuleTester();

const reportingRules = [
  'id-match',
];

const parser = require.resolve('@babel/eslint-parser');
const ajv = new Ajv({
  verbose: true,
});

for (const ruleName of reportingRules) {
  // eslint-disable-next-line import/no-dynamic-require
  const assertions = require('./assertions/' + camelCase(ruleName)).default;

  if (assertions.misconfigured) {
    for (const misconfiguration of assertions.misconfigured) {
      RuleTester.describe(ruleName, () => {
        RuleTester.describe('misconfigured', () => {
          RuleTester.it(JSON.stringify(misconfiguration.options), () => {
            const schema = plugin.rules[ruleName].schema && plugin.rules[ruleName].schema;

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

            assert.deepStrictEqual(validateSchema.errors, misconfiguration.errors);
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
