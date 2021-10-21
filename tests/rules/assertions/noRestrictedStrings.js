export default {
  invalid: [
    {
      code: 'var foo = "bar"',
      errors: [
        {
          message: 'Disallowed string: \'bar\'.',
          type: 'Literal',
        },
      ],
      options: [['bar']],
    },
    {
      // eslint-disable-next-line no-template-curly-in-string
      code: 'const foo = `bar ${baz}`;',
      errors: [
        {
          message: 'Disallowed string in template: \'bar\'.',
          type: 'TemplateElement',
        },
      ],
      options: [['bar']],
    },
  ],
  valid: [
    {
      code: 'const foo = "bar";',
    },
  ],
};
