/**
 * @file Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 * @see https://github.com/selaux/eslint-plugin-filenames/blob/32fc70dd7572211d1e5b97e06ec7a005c77fe8d4/lib/rules/match-regex.js
 */

import path from 'path';
import {
  getExportedName,
} from '../utilities/getExportedName';
import {
  isIgnoredFilename,
} from '../utilities/isIgnoredFilename';
import {
  parseFilename,
} from '../utilities/parseFilename';

const create = (context) => {
  const defaultRegexp = /^([\da-z]+)([A-Z][\da-z]+)*$/g;
  const conventionRegexp = context.options[0] ? new RegExp(context.options[0]) : defaultRegexp;
  const ignoreExporting = context.options[1] ? context.options[1] : false;

  return {
    Program (node) {
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
        context.report(node, 'Filename \'{{name}}\' does not match the naming convention.', {
          name: parsed.base,
        });
      }
    },
  };
};

export default {
  create,
};
