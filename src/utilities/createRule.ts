import {
  ESLintUtils,
} from '@typescript-eslint/utils';

export const createRule = ESLintUtils.RuleCreator(
  (name) => {
    return `https://github.com/gajus/eslint-plugin-canonical#eslint-plugin-canonical-rules-${name}`;
  },
);
