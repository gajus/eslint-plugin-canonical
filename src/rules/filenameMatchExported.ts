/**
 * @file Rule to ensure that filenames match the exports of the file
 * @author Stefan Lau
 * @see https://github.com/selaux/eslint-plugin-filenames/blob/32fc70dd7572211d1e5b97e06ec7a005c77fe8d4/lib/rules/match-exported.js
 */

import path from 'node:path';
import { camelCase, kebabCase, upperFirst, snakeCase } from 'lodash';
import {
  createRule,
  isIgnoredFilename,
  getExportedName,
  isIndexFile,
  parseFilename,
} from '../utilities';

const transformMap = {
  camel: camelCase,
  kebab: kebabCase,
  pascal(name) {
    return upperFirst(camelCase(name));
  },
  snake: snakeCase,
};

const getStringToCheckAgainstExport = (parsed, replacePattern?: RegExp) => {
  const directoryArray = parsed.dir.split(path.sep);
  const lastDirectory = directoryArray[directoryArray.length - 1];

  if (isIndexFile(parsed)) {
    return lastDirectory;
  }

  return replacePattern ? parsed.name.replace(replacePattern, '') : parsed.name;
};

const getTransformsFromOptions = (option) => {
  const usedTransforms = option?.push ? option : [option];

  return usedTransforms.map((name) => {
    return transformMap[name];
  });
};

const transform = (exportedName, transforms) => {
  return transforms.map((format) => {
    return format ? format(exportedName) : exportedName;
  });
};

const anyMatch = (expectedExport, transformedNames) => {
  return transformedNames.includes(expectedExport);
};

const getWhatToMatchMessage = (transforms) => {
  if (transforms.length === 1 && !transforms[0]) {
    return 'the exported name';
  }

  if (transforms.length > 1) {
    return 'any of the exported and transformed names';
  }

  return 'the exported and transformed name';
};

const create = (context) => {
  return {
    Program(node) {
      const transforms = getTransformsFromOptions(context.options[0]);
      const replacePattern = context.options[1]
        ? new RegExp(context.options[1], 'u')
        : undefined;
      const filename = context.getFilename();
      const absoluteFilename = path.resolve(filename);
      const parsed = parseFilename(absoluteFilename);
      const shouldIgnore = isIgnoredFilename(filename);
      const exportedName = getExportedName(node, context.options);
      const isExporting = Boolean(exportedName);
      const expectedExport = getStringToCheckAgainstExport(
        parsed,
        replacePattern,
      );
      const transformedNames = transform(exportedName, transforms);
      const everythingIsIndex =
        exportedName === 'index' && parsed.name === 'index';
      const matchesExported =
        anyMatch(expectedExport, transformedNames) || everythingIsIndex;
      const reportIf = function (
        condition,
        messageForNormalFile,
        messageForIndexFile,
      ) {
        const message =
          !messageForIndexFile || !isIndexFile(parsed)
            ? messageForNormalFile
            : messageForIndexFile;

        if (condition) {
          context.report({
            data: {
              expectedExport,
              exportName: transformedNames.join("', '"),
              extension: parsed.ext,
              name: parsed.base,
              whatToMatch: getWhatToMatchMessage(transforms),
            },
            message,
            node,
          });
        }
      };

      if (shouldIgnore) {
        return;
      }

      reportIf(
        isExporting && !matchesExported,
        "Filename '{{expectedExport}}' must match {{whatToMatch}} '{{exportName}}'.",
        "The directory '{{expectedExport}}' must be named '{{exportName}}', after the exported value of its index file.",
      );
    },
  };
};

export default createRule({
  create,
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Match the file name against the default exported value in the module.',
      recommended: 'warn',
    },
    messages: {},
    schema: [
      {
        anyOf: [
          {
            items: {
              type: 'string',
            },
            type: 'array',
          },
          {
            type: 'string',
          },
          {
            type: 'null',
          },
        ],
        default: null,
      },
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
  name: 'filename-match-exported',
});
