import { RuleTester } from '@typescript-eslint/rule-tester';
import * as test from 'mocha';

RuleTester.afterAll = test.after;

export { RuleTester } from '@typescript-eslint/rule-tester';
