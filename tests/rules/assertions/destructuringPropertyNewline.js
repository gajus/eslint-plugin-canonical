export default {
  invalid: [
    {
      code: 'const {a,b} = obj;',
      errors: [{
        messageId: 'propertiesOnNewline',
      }],
      output: 'const {a,\nb} = obj;',
    },
    {
      code: 'const [a,b] = obj;',
      errors: [{
        messageId: 'propertiesOnNewline',
      }],
      output: 'const [a,\nb] = obj;',
    },
    {
      code: 'const {a,b,c} = obj;',
      errors: [
        {
          messageId: 'propertiesOnNewline',
        },
        {
          messageId: 'propertiesOnNewline',
        },
      ],
      output: 'const {a,\nb,\nc} = obj;',
    },
    {
      code: 'const {\na,b} = obj;',
      errors: [
        {
          messageId: 'propertiesOnNewline',
        },
      ],
      output: 'const {\na,\nb} = obj;',
    },
    {
      code: '({a,b}) => {};',
      errors: [
        {
          messageId: 'propertiesOnNewline',
        },
      ],
      output: '({a,\nb}) => {};',
    },
  ],
  valid: [
    {
      code: 'const {a,\nb} = obj;',
    },
    {
      code: 'const {a} = obj;',
    },
    {
      code: 'const {\na\n} = obj;',
    },
    {
      code: '({a,\nb}) => {};',
    },
  ],
};
