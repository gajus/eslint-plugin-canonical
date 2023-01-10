/**
 * @file Rule to ensure that there exist no index files
 * @author Stefan Lau
 */

import path from 'node:path';
import { createRule } from '../utilities';
import { isIgnoredFilename } from '../utilities/isIgnoredFilename';
import { isIndexFile } from '../utilities/isIndexFile';
import { parseFilename } from '../utilities/parseFilename';

const create = (context) => {
  return {
    Program(node) {
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
          messageId: 'noIndex',
          node,
        });
      }
    },
  };
};

export default createRule({
  create,
  defaultOptions: [],
  meta: {
    docs: {
      description: '',
      recommended: false,
    },
    messages: {
      noIndex: "'index.js' files are not allowed.",
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'filename-no-index',
});
