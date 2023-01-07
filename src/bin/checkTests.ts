import fs from 'node:fs';
import path from 'node:path';
import {
  getRules,
  isFile,
} from './utilities';

const getTestIndexRules = () => {
  // eslint-disable-next-line node/no-sync
  const content = fs.readFileSync(path.resolve(__dirname, '../../tests/rules/index.js'), 'utf8');

  const result = {
    inRulesArray: false,
    rules: [] as string[],
  };

  const lines = content.split('\n');

  for (const line of lines) {
    if (result.inRulesArray) {
      if (line === '];') {
        result.inRulesArray = false;
      } else {
        result.rules.push(line.replace(/^\s*'([^']+)',?$/u, '$1'));
      }
    } else if (line === 'const reportingRules = [') {
      result.inRulesArray = true;
    }
  }

  const {
    rules,
  } = result;

  if (rules.length === 0) {
    throw new Error('Tests checker is broken - it could not extract rules from test index file.');
  }

  return rules;
};

/**
 * Performed checks:
 *  - file `/tests/rules/assertions/<rule>.js` exists
 *  - rule is included in `reportingRules` variable in `/tests/rules/index.js`
 */
const checkTests = (rulesNames: readonly string[]): void => {
  const testIndexRules = getTestIndexRules();

  const invalid = rulesNames.filter((names) => {
    const testExists = isFile(path.resolve(__dirname, '../../tests/rules/assertions', names[0] + '.js'));
    const inIndex = testIndexRules.includes(names[1]);

    return !(testExists && inIndex);
  });

  if (invalid.length > 0) {
    const invalidList = invalid.map((names) => {
      return names[0];
    }).join(', ');

    throw new Error(
      'Tests checker encountered an error in: ' + invalidList + '. ' +
      'Make sure that for every rule you created test suite and included the rule name in `tests/rules/index.js` file.',
    );
  }
};

checkTests(getRules());
