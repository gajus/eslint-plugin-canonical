import { createRule } from '../utilities';

const defaultOptions = {};

type Options = [
  {
    tsConfigPath?: string;
  },
];

type MessageIds = 'restrictedPrivateImport';

export default createRule<Options, MessageIds>({
  create: (context) => {
    return {
      ImportDeclaration(node) {
        console.log({ node });
      },
    };
  },
  defaultOptions: [defaultOptions],
  meta: {
    docs: {
      description: 'Enforces "virtual modules" architecture.',
      recommended: false,
    },
    messages: {
      restrictedPrivateImport:
        "Cannot import from '{{importPath}}' because '{{virtualModulePath}}' is a virtual module.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          tsConfigPath: {
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
    type: 'layout',
  },
  name: 'virtual-module',
});
