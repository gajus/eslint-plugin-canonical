import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../../src/rules/sortKeys';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('sort-keys', rule, {
  invalid: [
    // move comments on the same line as property together with property
    // not implemented yet
    // {
    //   code: 'var obj = {\na:1,\n _:2, // comment\n b:3\n}',
    //   errors: ["Expected object keys to be in ascending order. '_' should be before 'a'."],
    //   output: 'var obj = {\n_:2, // comment\n a:1,\n b:3\n}',
    // },

    // move inline comments on the line above property together with property
    {
      code: 'var obj = {\n// comment\n// comment 2\na:1,\n_:2,\nb:3\n}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'a',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {\n\n\n_:2,\n// comment\n// comment 2\na:1,\nb:3\n}',
    },

    // move multiline comments on the line above property together with property
    {
      code: 'var obj = {\n/* comment\n comment 2 */\na:1,\n_:2,\nb:3\n}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'a',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {\n\n_:2,\n/* comment\n comment 2 */\na:1,\nb:3\n}',
    },

    // default (asc)
    {
      code: 'var obj = {a:1, _:2, b:3} // default',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'a',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {_:2, a:1, b:3} // default',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {a:1, b:3, c:2}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'b_',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {a:2, b_:1, b:3}',
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'c',
            thisName: 'C',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {b_:1, C:3, c:2}',
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: '_',
            thisName: 'A',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {$:1, A:3, _:2, a:4}',
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'A',
            thisName: '11',
          },
          messageId: 'sort',
        },
      ],
      output: "var obj = {1:1, 2:4, '11':2, A:3}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'À',
            thisName: 'Z',
          },
          messageId: 'sort',
        },
      ],
      output: "var obj = {'#':1, 'Z':2, À:3, è:4}",
    },

    // not ignore properties not separated by spread properties
    {
      code: 'var obj = {...z, c:1, b:1}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {...z, b:1, c:1}',
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...z, ...c, d:4, b:1, ...y, ...f, e:2, a:1}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'd',
            thisName: 'b',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'ascending',
            prevName: 'e',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {...z, ...c, b:1, d:4, ...y, ...f, a:1, e:2}',
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {c:1, b:1, ...a}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {b:1, c:1, ...a}',
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...z, ...a, c:1, b:1}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {...z, ...a, b:1, c:1}',
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...z, b:1, a:1, ...d, ...c}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'b',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {...z, a:1, b:1, ...d, ...c}',
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...z, a:2, b:0, ...x, ...c}',
      errors: [
        {
          data: {
            order: 'descending',
            prevName: 'a',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: 'var obj = {...z, b:0, a:2, ...x, ...c}',
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...z, a:2, b:0, ...x}',
      errors: [
        {
          data: {
            order: 'descending',
            prevName: 'a',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: 'var obj = {...z, b:0, a:2, ...x}',
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: "var obj = {...z, '':1, a:2}",
      errors: [
        {
          data: {
            order: 'descending',
            prevName: '',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: "var obj = {...z, a:2, '':1}",
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },

    // ignore non-simple computed properties, but their position shouldn't affect other comparisons.
    {
      code: "var obj = {a:1, [b+c]:2, '':3}",
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'a',
            thisName: '',
          },
          messageId: 'sort',
        },
      ],
      output: "var obj = {'':3, [b+c]:2, a:1}",
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: "var obj = {'':1, [b+c]:2, a:3}",
      errors: [
        {
          data: {
            order: 'descending',
            prevName: '',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: "var obj = {a:3, [b+c]:2, '':1}",
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: "var obj = {b:1, [f()]:2, '':3, a:4}",
      errors: [
        {
          data: {
            order: 'descending',
            prevName: '',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: "var obj = {b:1, [f()]:2, a:4, '':3}",
      parserOptions: {
        ecmaVersion: 6,
      },
    },

    // not ignore simple computed properties.
    {
      code: 'var obj = {a:1, b:3, [a]: -1, c:2}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'b',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {a:1, [a]: -1, b:3, c:2}',
      parserOptions: {
        ecmaVersion: 6,
      },
    },

    // nested
    {
      code: 'var obj = {a:1, c:{y:1, x:1}, b:1}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'y',
            thisName: 'x',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      output: 'var obj = {a:1, b:1, c:{y:1, x:1}}',
    },

    // asc
    {
      code: 'var obj = {a:1, _:2, b:3} // asc',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'a',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      options: ['asc'],
      output: 'var obj = {_:2, a:1, b:3} // asc',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: ['asc'],
      output: 'var obj = {a:1, b:3, c:2}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'b_',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: ['asc'],
      output: 'var obj = {a:2, b_:1, b:3}',
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'c',
            thisName: 'C',
          },
          messageId: 'sort',
        },
      ],
      options: ['asc'],
      output: 'var obj = {b_:1, C:3, c:2}',
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: '_',
            thisName: 'A',
          },
          messageId: 'sort',
        },
      ],
      options: ['asc'],
      output: 'var obj = {$:1, A:3, _:2, a:4}',
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'A',
            thisName: '11',
          },
          messageId: 'sort',
        },
      ],
      options: ['asc'],
      output: "var obj = {1:1, 2:4, '11':2, A:3}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        {
          data: {
            order: 'ascending',
            prevName: 'À',
            thisName: 'Z',
          },
          messageId: 'sort',
        },
      ],
      options: ['asc'],
      output: "var obj = {'#':1, 'Z':2, À:3, è:4}",
    },

    // asc, minKeys should error when number of keys is greater than or equal to minKeys
    // {
    //   code: 'var obj = {a:1, _:2, b:3}',
    //   options: ['asc', { minKeys: 3 }],
    //   errors: ["Expected object keys to be in ascending order. '_' should be before 'a'."],
    // },

    // asc, insensitive
    {
      code: 'var obj = {a:1, _:2, b:3} // asc, insensitive',
      errors: [
        {
          data: {
            order: 'insensitive ascending',
            prevName: 'a',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {_:2, a:1, b:3} // asc, insensitive',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'insensitive ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {a:1, b:3, c:2}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'insensitive ascending',
            prevName: 'b_',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {a:2, b_:1, b:3}',
    },
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      errors: [
        {
          data: {
            order: 'insensitive ascending',
            prevName: 'A',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {$:1, _:2, A:3, a:4}',
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      errors: [
        {
          data: {
            order: 'insensitive ascending',
            prevName: 'A',
            thisName: '11',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
      output: "var obj = {1:1, 2:4, '11':2, A:3}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        "Expected object keys to be in insensitive ascending order. 'Z' should be before 'À'.",
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
      output: "var obj = {'#':1, 'Z':2, À:3, è:4}",
    },

    // asc, insensitive, minKeys should error when number of keys is greater than or equal to minKeys
    // {
    //   code: 'var obj = {a:1, _:2, b:3}',
    //   options: ['asc', { caseSensitive: false, minKeys: 3 }],
    //   errors: ["Expected object keys to be in insensitive ascending order. '_' should be before 'a'."],
    // },

    // asc, natural
    {
      code: 'var obj = {a:1, _:2, b:3} // asc, natural',
      errors: [
        {
          data: {
            order: 'natural ascending',
            prevName: 'a',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {_:2, a:1, b:3} // asc, natural',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'natural ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {a:1, b:3, c:2}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'natural ascending',
            prevName: 'b_',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {a:2, b_:1, b:3}',
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      errors: [
        {
          data: {
            order: 'natural ascending',
            prevName: 'c',
            thisName: 'C',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {b_:1, C:3, c:2}',
    },
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      errors: [
        {
          data: {
            order: 'natural ascending',
            prevName: 'A',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {$:1, _:2, A:3, a:4}',
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      errors: [
        {
          data: {
            order: 'natural ascending',
            prevName: 'A',
            thisName: '11',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          natural: true,
        },
      ],
      output: "var obj = {1:1, 2:4, '11':2, A:3}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        "Expected object keys to be in natural ascending order. 'Z' should be before 'À'.",
      ],
      options: [
        'asc',
        {
          natural: true,
        },
      ],
      output: "var obj = {'#':1, 'Z':2, À:3, è:4}",
    },

    // asc, natural, minKeys should error when number of keys is greater than or equal to minKeys
    // {
    //   code: 'var obj = {a:1, _:2, b:3}',
    //   options: ['asc', { natural: true, minKeys: 2 }],
    //   errors: ["Expected object keys to be in natural ascending order. '_' should be before 'a'."],
    // },

    // asc, natural, insensitive
    {
      code: 'var obj = {a:1, _:2, b:3} // asc, natural, insensitive',
      errors: [
        {
          data: {
            order: 'natural insensitive ascending',
            prevName: 'a',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {_:2, a:1, b:3} // asc, natural, insensitive',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'natural insensitive ascending',
            prevName: 'c',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {a:1, b:3, c:2}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'natural insensitive ascending',
            prevName: 'b_',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {a:2, b_:1, b:3}',
    },
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      errors: [
        {
          data: {
            order: 'natural insensitive ascending',
            prevName: 'A',
            thisName: '_',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {$:1, _:2, A:3, a:4}',
    },
    {
      code: "var obj = {1:1, '11':2, 2:4, A:3}",
      errors: [
        {
          data: {
            order: 'natural insensitive ascending',
            prevName: '11',
            thisName: '2',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: "var obj = {1:1, 2:4, '11':2, A:3}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        {
          data: {
            order: 'natural insensitive ascending',
            prevName: 'À',
            thisName: 'Z',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: "var obj = {'#':1, 'Z':2, À:3, è:4}",
    },

    // asc, natural, insensitive, minKeys should error when number of keys is greater than or equal to minKeys
    // {
    //   code: 'var obj = {a:1, _:2, b:3}',
    //   options: ['asc', { natural: true, caseSensitive: false, minKeys: 3 }],
    //   errors: ["Expected object keys to be in natural insensitive ascending order. '_' should be before 'a'."],
    // },

    // desc
    {
      code: 'var obj = {a:1, _:2, b:3} // desc',
      errors: [
        {
          data: {
            order: 'descending',
            prevName: '_',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: 'var obj = {a:1, b:3, _:2} // desc',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'descending',
            prevName: 'a',
            thisName: 'c',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: 'var obj = {c:2, a:1, b:3}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'descending',
            prevName: 'a',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: 'var obj = {b_:1, b:3, a:2}',
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      errors: [
        {
          data: {
            order: 'descending',
            prevName: 'b_',
            thisName: 'c',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: 'var obj = {c:2, b_:1, C:3}',
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      errors: [
        "Expected object keys to be in descending order. '_' should be before '$'.",
        {
          data: {
            order: 'descending',
            prevName: 'A',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: 'var obj = {_:2, $:1, a:4, A:3}',
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      errors: [
        {
          data: {
            order: 'descending',
            prevName: '1',
            thisName: '2',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'descending',
            prevName: '2',
            thisName: 'A',
          },
          messageId: 'sort',
        },
      ],
      options: ['desc'],
      output: "var obj = {2:4, 1:1, A:3, '11':2}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        "Expected object keys to be in descending order. 'À' should be before '#'.",
        "Expected object keys to be in descending order. 'è' should be before 'Z'.",
      ],
      options: ['desc'],
      output: "var obj = {À:3, '#':1, è:4, 'Z':2}",
    },

    // desc, minKeys should error when number of keys is greater than or equal to minKeys
    // {
    //   code: 'var obj = {a:1, _:2, b:3}',
    //   options: ['desc', { minKeys: 3 }],
    //   errors: ["Expected object keys to be in descending order. 'b' should be before '_'."],
    // },

    // desc, insensitive
    {
      code: 'var obj = {a:1, _:2, b:3} // desc, insensitive',
      errors: [
        {
          data: {
            order: 'insensitive descending',
            prevName: '_',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {a:1, b:3, _:2} // desc, insensitive',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'insensitive descending',
            prevName: 'a',
            thisName: 'c',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {c:2, a:1, b:3}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'insensitive descending',
            prevName: 'a',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {b_:1, b:3, a:2}',
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      errors: [
        {
          data: {
            order: 'insensitive descending',
            prevName: 'b_',
            thisName: 'c',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {c:2, b_:1, C:3}',
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      errors: [
        {
          data: {
            order: 'insensitive descending',
            prevName: '$',
            thisName: '_',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'insensitive descending',
            prevName: '_',
            thisName: 'A',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
      output: 'var obj = {_:2, $:1, A:3, a:4}',
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      errors: [
        {
          data: {
            order: 'insensitive descending',
            prevName: '1',
            thisName: '2',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'insensitive descending',
            prevName: '2',
            thisName: 'A',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
      output: "var obj = {2:4, 1:1, A:3, '11':2}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        {
          data: {
            order: 'insensitive descending',
            prevName: '#',
            thisName: 'À',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'insensitive descending',
            prevName: 'Z',
            thisName: 'è',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
      output: "var obj = {À:3, '#':1, è:4, 'Z':2}",
    },

    // desc, insensitive should error when number of keys is greater than or equal to minKeys
    // {
    //   code: 'var obj = {a:1, _:2, b:3}',
    //   options: ['desc', { caseSensitive: false, minKeys: 2 }],
    //   errors: ["Expected object keys to be in insensitive descending order. 'b' should be before '_'."],
    // },

    // desc, natural
    {
      code: 'var obj = {a:1, _:2, b:3} // desc, natural',
      errors: [
        {
          data: {
            order: 'natural descending',
            prevName: '_',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {a:1, b:3, _:2} // desc, natural',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'natural descending',
            prevName: 'a',
            thisName: 'c',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {c:2, a:1, b:3}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'natural descending',
            prevName: 'a',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {b_:1, b:3, a:2}',
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      errors: [
        {
          data: {
            order: 'natural descending',
            prevName: 'b_',
            thisName: 'c',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {c:2, b_:1, C:3}',
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      errors: [
        {
          data: {
            order: 'natural descending',
            prevName: '$',
            thisName: '_',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'natural descending',
            prevName: '_',
            thisName: 'A',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'natural descending',
            prevName: 'A',
            thisName: 'a',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          natural: true,
        },
      ],
      output: 'var obj = {_:2, $:1, a:4, A:3}',
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      errors: [
        {
          data: {
            order: 'natural descending',
            prevName: '1',
            thisName: '2',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'natural descending',
            prevName: '2',
            thisName: 'A',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          natural: true,
        },
      ],
      output: "var obj = {2:4, 1:1, A:3, '11':2}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        {
          data: {
            order: 'natural descending',
            prevName: '#',
            thisName: 'À',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'natural descending',
            prevName: 'Z',
            thisName: 'è',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          natural: true,
        },
      ],
      output: "var obj = {À:3, '#':1, è:4, 'Z':2}",
    },

    // desc, natural should error when number of keys is greater than or equal to minKeys
    // {
    //   code: 'var obj = {a:1, _:2, b:3}',
    //   options: ['desc', { natural: true, minKeys: 3 }],
    //   errors: ["Expected object keys to be in natural descending order. 'b' should be before '_'."],
    // },

    // desc, natural, insensitive
    {
      code: 'var obj = {a:1, _:2, b:3} // desc, natural, insensitive',
      errors: [
        {
          data: {
            order: 'natural insensitive descending',
            prevName: '_',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {a:1, b:3, _:2} // desc, natural, insensitive',
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        {
          data: {
            order: 'natural insensitive descending',
            prevName: 'a',
            thisName: 'c',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {c:2, a:1, b:3}',
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        {
          data: {
            order: 'natural insensitive descending',
            prevName: 'a',
            thisName: 'b',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {b_:1, b:3, a:2}',
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      errors: [
        {
          data: {
            order: 'natural insensitive descending',
            prevName: 'b_',
            thisName: 'c',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {c:2, b_:1, C:3}',
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      errors: [
        {
          data: {
            order: 'natural insensitive descending',
            prevName: '$',
            thisName: '_',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'natural insensitive descending',
            prevName: '_',
            thisName: 'A',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: 'var obj = {_:2, $:1, A:3, a:4}',
    },
    {
      code: "var obj = {1:1, 2:4, '11':2, A:3}",
      errors: [
        {
          data: {
            order: 'natural insensitive descending',
            prevName: '1',
            thisName: '2',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'natural insensitive descending',
            prevName: '2',
            thisName: '11',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'natural insensitive descending',
            prevName: '11',
            thisName: 'A',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: "var obj = {2:4, 1:1, A:3, '11':2}",
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        {
          data: {
            order: 'natural insensitive descending',
            prevName: '#',
            thisName: 'À',
          },
          messageId: 'sort',
        },
        {
          data: {
            order: 'natural insensitive descending',
            prevName: 'Z',
            thisName: 'è',
          },
          messageId: 'sort',
        },
      ],
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
      output: "var obj = {À:3, '#':1, è:4, 'Z':2}",
    },

    // desc, natural, insensitive should error when number of keys is greater than or equal to minKeys
    // {
    //   code: 'var obj = {a:1, _:2, b:3}',
    //   options: ['desc', { natural: true, caseSensitive: false, minKeys: 2 }],
    //   errors: ["Expected object keys to be in natural insensitive descending order. 'b' should be before '_'."],
    // },
  ],
  valid: [
    // default (asc)
    {
      code: 'var obj = {_:2, a:1, b:3} // default',
      options: [],
    },
    {
      code: 'var obj = {a:1, b:3, c:2}',
      options: [],
    },
    {
      code: 'var obj = {a:2, b:3, b_:1}',
      options: [],
    },
    {
      code: 'var obj = {C:3, b_:1, c:2}',
      options: [],
    },
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      options: [],
    },
    {
      code: "var obj = {1:1, '11':2, 2:4, A:3}",
      options: [],
    },
    {
      code: "var obj = {'#':1, 'Z':2, À:3, è:4}",
      options: [],
    },

    // ignore non-simple computed properties.
    {
      code: 'var obj = {a:1, b:3, [a + b]: -1, c:2}',
      options: [],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: "var obj = {'':1, [f()]:2, a:3}",
      options: [],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: "var obj = {a:1, [b++]:2, '':3}",
      options: ['desc'],
      parserOptions: {
        ecmaVersion: 6,
      },
    },

    // ignore properties separated by spread properties
    {
      code: 'var obj = {a:1, ...z, b:1}',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {b:1, ...z, a:1}',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...a, b:1, ...c, d:1}',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...a, b:1, ...d, ...c, e:2, z:5}',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {b:1, ...c, ...d, e:2}',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: "var obj = {a:1, ...z, '':2}",
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: "var obj = {'':1, ...z, 'a':2}",
      options: ['desc'],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },

    // not ignore properties not separated by spread properties
    {
      code: 'var obj = {...z, a:1, b:1}',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...z, ...c, a:1, b:1}',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {a:1, b:1, ...z}',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'var obj = {...z, ...x, a:1, ...c, ...d, f:5, e:4}',
      options: ['desc'],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },

    // works when spread occurs somewhere other than an object literal
    {
      code: 'function fn(...args) { return [...args].length; }',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },
    {
      code: 'function g() {}; function f(...args) { return g(...args); }',
      options: [],
      parserOptions: {
        ecmaVersion: 2_018,
      },
    },

    // ignore destructuring patterns.
    {
      code: 'let {a, b} = {}',
      options: [],
      parserOptions: {
        ecmaVersion: 6,
      },
    },

    // nested
    {
      code: 'var obj = {a:1, b:{x:1, y:1}, c:1}',
      options: [],
    },

    // asc
    {
      code: 'var obj = {_:2, a:1, b:3} // asc',
      options: ['asc'],
    },
    {
      code: 'var obj = {a:1, b:3, c:2}',
      options: ['asc'],
    },
    {
      code: 'var obj = {a:2, b:3, b_:1}',
      options: ['asc'],
    },
    {
      code: 'var obj = {C:3, b_:1, c:2}',
      options: ['asc'],
    },
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      options: ['asc'],
    },
    {
      code: "var obj = {1:1, '11':2, 2:4, A:3}",
      options: ['asc'],
    },
    {
      code: "var obj = {'#':1, 'Z':2, À:3, è:4}",
      options: ['asc'],
    },

    // asc, minKeys should ignore unsorted keys when number of keys is less than minKeys
    // { code: "var obj = {a:1, c:2, b:3}", options: ["asc", { minKeys: 4 }] },

    // asc, insensitive
    {
      code: 'var obj = {_:2, a:1, b:3} // asc, insensitive',
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {a:1, b:3, c:2}',
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {a:2, b:3, b_:1}',
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {b_:1, C:3, c:2}',
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {b_:1, c:3, C:2}',
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: "var obj = {1:1, '11':2, 2:4, A:3}",
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: "var obj = {'#':1, 'Z':2, À:3, è:4}",
      options: [
        'asc',
        {
          caseSensitive: false,
        },
      ],
    },

    // asc, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
    // { code: "var obj = {$:1, A:3, _:2, a:4}", options: ["asc", { caseSensitive: false, minKeys: 5 }] },

    // asc, natural
    {
      code: 'var obj = {_:2, a:1, b:3} // asc, natural',
      options: [
        'asc',
        {
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {a:1, b:3, c:2}',
      options: [
        'asc',
        {
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {a:2, b:3, b_:1}',
      options: [
        'asc',
        {
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {C:3, b_:1, c:2}',
      options: [
        'asc',
        {
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: [
        'asc',
        {
          natural: true,
        },
      ],
    },
    {
      code: "var obj = {1:1, 2:4, '11':2, A:3}",
      options: [
        'asc',
        {
          natural: true,
        },
      ],
    },
    {
      code: "var obj = {'#':1, 'Z':2, À:3, è:4}",
      options: [
        'asc',
        {
          natural: true,
        },
      ],
    },

    // asc, natural, minKeys should ignore unsorted keys when number of keys is less than minKeys
    // { code: "var obj = {b_:1, a:2, b:3}", options: ["asc", { natural: true, minKeys: 4 }] },

    // asc, natural, insensitive
    {
      code: 'var obj = {_:2, a:1, b:3} // asc, natural, insensitive',
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {a:1, b:3, c:2}',
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {a:2, b:3, b_:1}',
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {b_:1, C:3, c:2}',
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {b_:1, c:3, C:2}',
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: "var obj = {1:1, 2:4, '11':2, A:3}",
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: "var obj = {'#':1, 'Z':2, À:3, è:4}",
      options: [
        'asc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },

    // asc, natural, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
    // { code: "var obj = {a:1, _:2, b:3}", options: ["asc", { natural: true, caseSensitive: false, minKeys: 4 }] },

    // desc
    {
      code: 'var obj = {b:3, a:1, _:2} // desc',
      options: ['desc'],
    },
    {
      code: 'var obj = {c:2, b:3, a:1}',
      options: ['desc'],
    },
    {
      code: 'var obj = {b_:1, b:3, a:2}',
      options: ['desc'],
    },
    {
      code: 'var obj = {c:2, b_:1, C:3}',
      options: ['desc'],
    },
    {
      code: 'var obj = {a:4, _:2, A:3, $:1}',
      options: ['desc'],
    },
    {
      code: "var obj = {A:3, 2:4, '11':2, 1:1}",
      options: ['desc'],
    },
    {
      code: "var obj = {è:4, À:3, 'Z':2, '#':1}",
      options: ['desc'],
    },

    // desc, minKeys should ignore unsorted keys when number of keys is less than minKeys
    // { code: "var obj = {a:1, c:2, b:3}", options: ["desc", { minKeys: 4 }] },

    // desc, insensitive
    {
      code: 'var obj = {b:3, a:1, _:2} // desc, insensitive',
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {c:2, b:3, a:1}',
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {b_:1, b:3, a:2}',
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {c:2, C:3, b_:1}',
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {C:2, c:3, b_:1}',
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: 'var obj = {a:4, A:3, _:2, $:1}',
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: "var obj = {A:3, 2:4, '11':2, 1:1}",
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
    },
    {
      code: "var obj = {è:4, À:3, 'Z':2, '#':1}",
      options: [
        'desc',
        {
          caseSensitive: false,
        },
      ],
    },

    // desc, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
    // { code: "var obj = {$:1, _:2, A:3, a:4}", options: ["desc", { caseSensitive: false, minKeys: 5 }] },

    // desc, natural
    {
      code: 'var obj = {b:3, a:1, _:2} // desc, natural',
      options: [
        'desc',
        {
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {c:2, b:3, a:1}',
      options: [
        'desc',
        {
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {b_:1, b:3, a:2}',
      options: [
        'desc',
        {
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {c:2, b_:1, C:3}',
      options: [
        'desc',
        {
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {a:4, A:3, _:2, $:1}',
      options: [
        'desc',
        {
          natural: true,
        },
      ],
    },
    {
      code: "var obj = {A:3, '11':2, 2:4, 1:1}",
      options: [
        'desc',
        {
          natural: true,
        },
      ],
    },
    {
      code: "var obj = {è:4, À:3, 'Z':2, '#':1}",
      options: [
        'desc',
        {
          natural: true,
        },
      ],
    },

    // desc, natural, minKeys should ignore unsorted keys when number of keys is less than minKeys
    // { code: "var obj = {b_:1, a:2, b:3}", options: ["desc", { natural: true, minKeys: 4 }] },

    // desc, natural, insensitive
    {
      code: 'var obj = {b:3, a:1, _:2} // desc, natural, insensitive',
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {c:2, b:3, a:1}',
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {b_:1, b:3, a:2}',
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {c:2, C:3, b_:1}',
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {C:2, c:3, b_:1}',
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: 'var obj = {a:4, A:3, _:2, $:1}',
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: "var obj = {A:3, '11':2, 2:4, 1:1}",
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },
    {
      code: "var obj = {è:4, À:3, 'Z':2, '#':1}",
      options: [
        'desc',
        {
          caseSensitive: false,
          natural: true,
        },
      ],
    },

    // desc, natural, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
    // { code: "var obj = {a:1, _:2, b:3}", options: ["desc", { natural: true, caseSensitive: false, minKeys: 4 }] }
  ],
});
