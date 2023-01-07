export default {
  invalid: [
    {
      code: 'import type {foo} from \'bar\'',
      errors: [
        {
          messageId: 'noTypeImport',
        },
      ],
      output: 'import {type foo} from \'bar\'',
    },
    {
      code: 'import type {foo, baz} from \'bar\'',
      errors: [
        {
          messageId: 'noTypeImport',
        },
      ],
      output: 'import {type foo, type baz} from \'bar\'',
    },
  ],
  valid: [
    {
      code: 'import {type foo} from \'bar\'',
    },
    {
      code: 'import type Foo from \'bar\'',
    },
    {
      code: 'import type * as Foo from \'bar\'',
    },
  ],
};
