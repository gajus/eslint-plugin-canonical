export default {
  invalid: [
    {
      code: `import { bar } from '@/Bar/utilities';`,
      errors: [
        {
          message:
            "Cannot import from '@/Bar/utilities' because '@/Bar' is a virtual module.",
        },
      ],
    },
  ],
  valid: [],
};
