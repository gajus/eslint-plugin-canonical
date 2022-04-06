export default {
  invalid: [
    {
      code: 'import type {foo} from \'bar\'',
      errors: [{
        messageId: 'noTypeImport',
      }],
      output: 'import {type foo} from \'bar\'',
    },
  ],
  valid: [
    {
      code: 'import {type foo} from \'bar\'',
    },
  ],
};
