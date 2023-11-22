/* eslint-disable @typescript-eslint/no-non-null-assertion */

/**
 * @file Rule to ensure that filenames match the exports of the file
 * @author Stefan Lau
 * @see https://github.com/selaux/eslint-plugin-filenames/blob/32fc70dd7572211d1e5b97e06ec7a005c77fe8d4/lib/rules/match-exported.js
 */

import {
  createRule,
  getExportedName,
  isIgnoredFilename,
  isIndexFile,
  parseFilename,
} from '../utilities';
import { camelCase, kebabCase, snakeCase, upperFirst } from 'lodash';
import path from 'node:path';

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

type Options = [
  {
    matchCallExpression?: boolean;
    suffix?: string | null;
    transforms?: string[] | string | null;
  },
];

type MessageIds = 'indexFile' | 'regularFile';

export default createRule<Options, MessageIds>({
  create: (context, [options]) => {
    return {
      Program(node) {
        const transforms = getTransformsFromOptions(options.transforms);
        const replacePattern = options.suffix
          ? new RegExp(options.suffix, 'u')
          : undefined;
        const filename = context.getFilename();
        const absoluteFilename = path.resolve(filename);
        const parsed = parseFilename(absoluteFilename);
        const shouldIgnore = isIgnoredFilename(filename);
        const exportedName = getExportedName(
          node,
          Boolean(options.matchCallExpression),
        );
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

        if (shouldIgnore || !isExporting || matchesExported) {
          return;
        }

        context.report({
          data: {
            expectedExport,
            exportName: transformedNames.join("', '"),
            extension: parsed.ext,
            name: parsed.base,
            whatToMatch: getWhatToMatchMessage(transforms),
          },
          messageId: isIndexFile(parsed) ? 'indexFile' : 'regularFile',
          node,
        });
      },
    };
  },
  defaultOptions: [
    {
      matchCallExpression: false,
      suffix: null,
      transforms: null,
    },
  ],
  meta: {
    docs: {
      description:
        'Match the file name against the default exported value in the module.',
      recommended: 'recommended',
    },
    messages: {
      indexFile:
        "The directory '{{expectedExport}}' must be named '{{exportName}}', after the exported value of its index file.",
      regularFile:
        "Filename '{{expectedExport}}' must match {{whatToMatch}} '{{exportName}}'.",
    },
    schema: [
      {
        properties: {
          matchCallExpression: {
            type: 'boolean',
          },
          suffix: {
            oneOf: [
              {
                type: 'string',
              },
              {
                type: 'null',
              },
            ],
          },
          transforms: {
            oneOf: [
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
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'filename-match-exported',
});
