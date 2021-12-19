/**
 * @file Rule to ensure that there exist no index files
 * @author Stefan Lau
 */

import path from 'path';
import {
  isIgnoredFilename,
} from '../utilities/isIgnoredFilename';
import {
  isIndexFile,
} from '../utilities/isIndexFile';
import {
  parseFilename,
} from '../utilities/parseFilename';

const create = (context) => {
  return {
    Program (node) {
      const filename = context.getFilename();
      const absoluteFilename = path.resolve(filename);
      const parsed = parseFilename(absoluteFilename);
      const shouldIgnore = isIgnoredFilename(filename);
      const isIndex = isIndexFile(parsed);

      if (shouldIgnore) {
        return;
      }

      if (isIndex) {
        context.report({
          message: '\'index.js\' files are not allowed.', node,
        });
      }
    },
  };
};

export default {
  create,
  meta: {
    schema: [],
    type: 'suggestion',
  },
};
