/**
 * @file Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 * @see https://github.com/selaux/eslint-plugin-filenames/blob/32fc70dd7572211d1e5b97e06ec7a005c77fe8d4/lib/rules/match-regex.js
 */

import path from 'node:path';
import {
  createRule,
  getExportedName,
  isIgnoredFilename,
  parseFilename,
} from '../utilities';

// eslint-disable-next-line unicorn/no-unsafe-regex
const defaultRegexp = /^[\da-z]+(?:[A-Z][\da-z]+)*$/gu;

type Options = [
  {
    ignoreExporting: boolean;
    regex: string | null;
  },
];

type MessageIds = 'notMatch';

export default createRule<Options, MessageIds>({
  create: (context, [options]) => {
    const conventionRegexp = options.regex
      ? new RegExp(options.regex, 'u')
      : defaultRegexp;
    const ignoreExporting = options.ignoreExporting;

    return {
      Program(node) {
        conventionRegexp.lastIndex = 0;

        const filename = context.getFilename();
        const absoluteFilename = path.resolve(filename);
        const parsed = parseFilename(absoluteFilename);
        const shouldIgnore = isIgnoredFilename(filename);
        const matchesRegex = conventionRegexp.test(parsed.name);

        if (shouldIgnore) {
          return;
        }

        const isExporting = Boolean(getExportedName(node, false));

        if (ignoreExporting && isExporting) {
          return;
        }

        if (!matchesRegex) {
          context.report({
            data: {
              name: parsed.base,
            },
            messageId: 'notMatch',
            node,
          });
        }
      },
    };
  },
  defaultOptions: [
    {
      ignoreExporting: false,
      regex: null,
    },
  ],
  meta: {
    docs: {
      description:
        'Enforce a certain file naming convention using a regular expression.',
      recommended: 'warn',
    },
    messages: {
      notMatch: "Filename '{{name}}' does not match the naming convention.",
    },
    schema: [
      {
        properties: {
          ignoreExporting: {
            type: 'boolean',
          },
          regex: {
            oneOf: [
              {
                type: 'string',
              },
              {
                type: 'null',
              },
            ],
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'filename-match-regex',
});
