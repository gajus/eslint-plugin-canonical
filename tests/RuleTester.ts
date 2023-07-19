import { RuleTester } from '@typescript-eslint/rule-tester';
import * as test from 'mocha';

if (typeof global.it === 'function') {
  RuleTester.afterAll = test.after;
} else {
  RuleTester.afterAll = () => {};
  RuleTester.describe = () => {};
}

export { RuleTester } from '@typescript-eslint/rule-tester';
