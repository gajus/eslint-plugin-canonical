/**
 * @file Rule to flag non-matching identifiers
 * @author Matthieu Larcher
 *
 * Adapted from https://github.com/eslint/eslint/blob/c4fffbcb089182d425ef1d5e45134fecc0e2da46/tests/lib/rules/id-match.js
 * Related discussion about not adding this option to ESLint https://github.com/eslint/eslint/issues/14005
 */

import {parser as typescriptEslintParser} from 'typescript-eslint';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import rule from '../../src/rules/idMatch';
import { createRuleTester } from '../RuleTester';

const error = {
  messageId: 'notMatch' as const,
  type: AST_NODE_TYPES.Identifier,
};

export default createRuleTester(
  'id-match',
  rule,
  {
    languageOptions: { parser: typescriptEslintParser },
  },
  {
    invalid: [
      {
        code: 'var __foo = "Matthieu"',
        errors: [error],
        options: [
          '^[a-z]+$',
          {
            onlyDeclarations: true,
          },
        ],
      },
      {
        code: 'first_name = "Matthieu"',
        errors: [error],
        options: ['^[a-z]+$'],
      },
      {
        code: 'first_name = "Matthieu"',
        errors: [error],
        options: ['^z'],
      },
      {
        code: 'Last_Name = "Larcher"',
        errors: [error],
        options: ['^[a-z]+(_[A-Z][a-z])*$'],
      },
      {
        code: 'var obj = {key: no_under}',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'function no_under21(){}',
        errors: [error],
        options: ['^[^_]+$'],
      },
      {
        code: 'obj.no_under22 = function(){};',
        errors: [error],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'no_under23.foo = function(){};',
        errors: [error],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: '[no_under24.baz]',
        errors: [error],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'if (foo.bar_baz === boom.bam_pow) { [no_under25.baz] }',
        errors: [error],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'foo.no_under26 = boom.bam_pow',
        errors: [error],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'var foo = { no_under27: boom.bam_pow }',
        errors: [error],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'foo.qux.no_under28 = { bar: boom.bam_pow }',
        errors: [error],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'var o = {no_under29: 1}',
        errors: [error],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'obj.no_under30 = 2;',
        errors: [
          {
            data: {
              name: 'no_under30',
              pattern: '^[^_]+$',
            },
            messageId: 'notMatch',
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'var { category_id: category_alias } = query;',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'var { category_id: category_alias } = query;',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            ignoreDestructuring: true,
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'var { category_id: categoryId, ...other_props } = query;',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            ignoreDestructuring: true,
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 2_018,
        },
      },
      {
        code: 'var { category_id } = query;',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'var { category_id = 1 } = query;',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'import no_camelcased from "external-module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: 'import * as no_camelcased from "external-module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: 'export * as no_camelcased from "external-module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: ['^[^_]+$'],
        languageOptions: {
          ecmaVersion: 2_020,
          sourceType: 'module',
        },
      },
      {
        code: 'import { no_camelcased as no_camel_cased } from "external module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: 'import { camelCased as no_camel_cased } from "external module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: 'import { camelCased, no_camelcased } from "external-module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: 'import { no_camelcased as camelCased, another_no_camelcased } from "external-module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: 'import camelCased, { no_camelcased } from "external-module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: 'import no_camelcased, { another_no_camelcased as camelCased } from "external-module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: 'function foo({ no_camelcased }) {};',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: "function foo({ no_camelcased = 'default value' }) {};",
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'const no_camelcased = 0; function foo({ camelcased_value = no_camelcased }) {}',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'const { bar: no_camelcased } = foo;',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'function foo({ value_1: my_default }) {}',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'function foo({ isCamelcased: no_camelcased }) {};',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'var { foo: bar_baz = 1 } = quz;',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'const { no_camelcased = false } = bar;',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },

      // Class Methods
      {
        code: 'class x { _foo() {} }',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: ['^[^_]+$'],
        languageOptions: {
          ecmaVersion: 2_022,
        },
      },

      // {
      //   code: 'class x { #_foo() {} }',
      //   errors: [
      //     {
      //       message: 'Identifier \'#_foo\' does not match the pattern \'^[^_]+$\'.',
      //       type: 'PrivateIdentifier',
      //     },
      //   ],
      //   options: ['^[^_]+$'],
      //   languageOptions: {ecmaVersion: 2_022},
      // },

      // Class Fields
      {
        code: 'class x { _foo = 1; }',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            classFields: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 2_022,
        },
      },

      // {
      //   code: 'class x { #_foo = 1; }',
      //   errors: [
      //     {
      //       message: 'Identifier \'#_foo\' does not match the pattern \'^[^_]+$\'.',
      //       type: 'PrivateIdentifier',
      //     },
      //   ],
      //   options: ['^[^_]+$', {
      //     classFields: true,
      //   }],
      //   languageOptions: {ecmaVersion: 2_022},
      // },

      // Named Imports

      {
        code: 'import { no_camelcased } from "external-module";',
        errors: [
          {
            messageId: 'notMatch',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        options: [
          '^[^_]+$',
          {
            ignoreNamedImports: false,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
    ],
    valid: [
      {
        code: '__foo = "Matthieu"',
        options: [
          '^[a-z]+$',
          {
            onlyDeclarations: true,
          },
        ],
      },
      {
        code: 'firstname = "Matthieu"',
        options: ['^[a-z]+$'],
      },
      {
        code: 'first_name = "Matthieu"',
        options: ['[a-z]+'],
      },
      {
        code: 'firstname = "Matthieu"',
        options: ['^f'],
      },
      {
        code: 'last_Name = "Larcher"',
        options: ['^[a-z]+(_[A-Z][a-z]+)*$'],
      },
      {
        code: 'param = "none"',
        options: ['^[a-z]+(_[A-Z][a-z])*$'],
      },
      {
        code: 'function noUnder(){}',
        options: ['^[^_]+$'],
      },
      {
        code: 'no_under()',
        options: ['^[^_]+$'],
      },
      {
        code: 'foo.no_under2()',
        options: ['^[^_]+$'],
      },
      {
        code: 'var foo = bar.no_under3;',
        options: ['^[^_]+$'],
      },
      {
        code: 'var foo = bar.no_under4.something;',
        options: ['^[^_]+$'],
      },
      {
        code: 'foo.no_under5.qux = bar.no_under6.something;',
        options: ['^[^_]+$'],
      },
      {
        code: 'if (bar.no_under7) {}',
        options: ['^[^_]+$'],
      },
      {
        code: 'var obj = { key: foo.no_under8 };',
        options: ['^[^_]+$'],
      },
      {
        code: 'var arr = [foo.no_under9];',
        options: ['^[^_]+$'],
      },
      {
        code: '[foo.no_under10]',
        options: ['^[^_]+$'],
      },
      {
        code: 'var arr = [foo.no_under11.qux];',
        options: ['^[^_]+$'],
      },
      {
        code: '[foo.no_under12.nesting]',
        options: ['^[^_]+$'],
      },
      {
        code: 'if (foo.no_under13 === boom.no_under14) { [foo.no_under15] }',
        options: ['^[^_]+$'],
      },
      {
        code: 'var myArray = new Array(); var myDate = new Date();',
        options: ['^[a-z$]+([A-Z][a-z]+)*$'],
      },
      {
        code: 'var x = obj._foo;',
        options: ['^[^_]+$'],
      },
      {
        code: 'var obj = {key: no_under}',
        options: [
          '^[^_]+$',
          {
            onlyDeclarations: true,
            properties: true,
          },
        ],
      },
      {
        code: 'var {key_no_under: key} = {}',
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'var { category_id } = query;',
        options: [
          '^[^_]+$',
          {
            ignoreDestructuring: true,
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'var { category_id: category_id } = query;',
        options: [
          '^[^_]+$',
          {
            ignoreDestructuring: true,
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'var { category_id = 1 } = query;',
        options: [
          '^[^_]+$',
          {
            ignoreDestructuring: true,
            properties: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
        },
      },
      {
        code: 'var o = {key: 1}',
        options: [
          '^[^_]+$',
          {
            properties: true,
          },
        ],
      },
      {
        code: 'var o = {no_under16: 1}',
        options: [
          '^[^_]+$',
          {
            properties: false,
          },
        ],
      },
      {
        code: 'obj.no_under17 = 2;',
        options: [
          '^[^_]+$',
          {
            properties: false,
          },
        ],
      },
      {
        code: 'var obj = {\n no_under18: 1 \n};\n obj.no_under19 = 2;',
        options: [
          '^[^_]+$',
          {
            properties: false,
          },
        ],
      },
      {
        code: 'obj.no_under20 = function(){};',
        options: [
          '^[^_]+$',
          {
            properties: false,
          },
        ],
      },
      {
        code: 'var x = obj._foo2;',
        options: [
          '^[^_]+$',
          {
            properties: false,
          },
        ],
      },

      // Class Methods
      {
        code: 'class x { foo() {} }',
        options: ['^[^_]+$'],
        languageOptions: {
          ecmaVersion: 2_022,
        },
      },
      {
        code: 'class x { #foo() {} }',
        options: ['^[^_]+$'],
        languageOptions: {
          ecmaVersion: 2_022,
        },
      },

      // Class Fields
      // {
      //   code: 'class x { _foo = 1; }',
      //   options: ['^[^_]+$', {
      //     classFields: false,
      //   }],
      //   languageOptions: {ecmaVersion: 2_022},
      // },

      // {
      //   code: 'class x { #_foo = 1; }',
      //   options: ['^[^_]+$', {
      //     classFields: false,
      //   }],
      //   languageOptions: {ecmaVersion: 2_022},
      // },

      // Named Imports

      {
        code: 'import { no_camelcased } from "external-module";',
        options: [
          '^[^_]+$',
          {
            ignoreNamedImports: true,
          },
        ],
        languageOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
      },
      {
        code: `
        const {
          index,
          '0': n0,
          '1': n1,
        } = exampleCode;
      `,
        options: ['^[a-zA-Z\\d]+$'],
      },
    ],
  },
);
