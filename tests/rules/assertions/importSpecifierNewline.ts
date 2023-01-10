export default {
  invalid: [
    {
      code: "import {a, b} from 'foo';",
      errors: [
        {
          messageId: 'specifiersOnNewline',
          type: 'ImportDeclaration',
        },
      ],
      output: "import {a,\nb} from 'foo';",
    },
    {
      code: "import a, {b, c} from 'foo';",
      errors: [
        {
          messageId: 'specifiersOnNewline',
          type: 'ImportDeclaration',
        },
      ],
      output: "import a, {b,\nc} from 'foo';",
    },
  ],
  valid: [
    {
      code: "import {a,\nb} from 'foo'",
    },
    {
      code: "import a, {b,\nc} from 'foo'",
    },
  ],
};
