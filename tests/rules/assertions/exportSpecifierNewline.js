export default {
  invalid: [
    {
      code: 'const a = 1; const b = 2; const c = 3; export { a, b, c };',
      errors: [
        {
          type: 'ExportNamedDeclaration',
        },
        {
          type: 'ExportNamedDeclaration',
        },
      ],
      output: 'const a = 1; const b = 2; const c = 3; export { a,\nb,\nc };',
    },
    {
      code: 'const a = 1; const b = 2; const c = 3; export { a, b, c, };',
      errors: [
        {
          type: 'ExportNamedDeclaration',
        },
        {
          type: 'ExportNamedDeclaration',
        },
      ],
      output: 'const a = 1; const b = 2; const c = 3; export { a,\nb,\nc, };',
    },
    {
      code: 'const a = 1; const b = 2; export { a as default, b }',
      errors: [
        {
          type: 'ExportNamedDeclaration',
        },
      ],
      output: 'const a = 1; const b = 2; export { a as default,\nb }',
    },
  ],
  valid: [
    {
      code: 'export { \n a,\nb,\nc\n } from \'foo\'',
    },
    {
      code: 'const a = 1; const b = 2; const c = 3; export { \n a,\nb,\nc\n };',
    },
    {
      code: 'export * from \'foo\'',
    },
  ],
};
