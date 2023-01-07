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
const defaultRegexp = /^[\da-z]+(?:[A-Z][\da-z]+)*$/ug;

export default createRule({
  create: (context) => {
    const conventionRegexp = context.options[0] ? new RegExp(context.options[0], 'u') : defaultRegexp;
    const ignoreExporting = context.options[1] ? context.options[1] : false;

    return {
      Program (node) {
        conventionRegexp.lastIndex = 0;

        const filename = context.getFilename();
        const absoluteFilename = path.resolve(filename);
        const parsed = parseFilename(absoluteFilename);
        const shouldIgnore = isIgnoredFilename(filename);
        const isExporting = Boolean(getExportedName(node));

        const matchesRegex = conventionRegexp.test(parsed.name);

        if (shouldIgnore) {
          return;
        }

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
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Enforce a certain file naming convention using a regular expression.',
      recommended: 'warn',
    },
    messages: {
      notMatch: 'Filename \'{{name}}\' does not match the naming convention.',
    },
    schema: [
      {
        default: null,
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
      },
      {
        default: false,
        type: 'boolean',
      },
    ],
    type: 'suggestion',
  },
  name: 'filename-match-regex',

});
