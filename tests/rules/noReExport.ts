/**
 * The code is adapted from https://github.com/christianvuerings/eslint-plugin-no-re-export
 */
import rule from '../../src/rules/noReExport';
import { createRuleTester } from '../RuleTester';

export default createRuleTester(
  'no-re-export',
  rule,
  { parser: '@typescript-eslint/parser' },
  {
    invalid: [
      {
        code: `
          import Button1 from 'app/CustomButton';
          export const CustomButton = Button1;
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
        ],
      },
      {
        code: `
          import { Button as CustomButton2 } from 'app/CustomButton';
          export const CustomButton = CustomButton2;
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
        ],
      },
      {
        code: `
          import * as Button3 from "app/Button";
          export const CustomButton = Button3;
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
        ],
      },
      {
        code: `
          import Button4 from 'app/CustomButton';
          export default Button4;
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
        ],
      },
      {
        code: `
          export { default as Button5 } from 'app/CustomButton';
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
        ],
      },
      {
        code: `
          import Button6 from 'app/CustomButton';
          export {
            Button6
          };
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
        ],
      },
      {
        code: `
          import Button7 from 'app/CustomButton';
          export const Buttons = {
            Button: Button7
          };
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
        ],
      },
      {
        code: `
          import Button8 from 'app/CustomButton';
          export default Button8;
          export { Button8 }
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
          {
            messageId: 'noReExport',
          },
        ],
      },
      {
        code: `
          export * from 'app/CustomButton';
        `,
        errors: [
          {
            messageId: 'noReExport',
          },
        ],
      },
    ],
    valid: [],
  },
);
