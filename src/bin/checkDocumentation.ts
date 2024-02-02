import fs from 'node:fs';
import path from 'node:path';
import { getRules, isFile } from './utilities';

const windows = <T>(array: T[], size): T[][] => {
  const output: T[][] = [];

  for (let ii = 0; ii < array.length - size + 1; ii++) {
    const slice = array.slice(ii, ii + size);

    output.push(slice);
  }

  return output;
};

const getDocumentIndexRules = () => {
  // eslint-disable-next-line node/no-sync
  const content = fs.readFileSync(
    path.resolve(__dirname, '../../.README/README.md'),
    'utf8',
  );

  const ruleMatcher =
    /(?<=^\{"gitdown": "include", "file": "\.\/rules\/)[^"]+(?=\.md"\}$)/gmu;

  const rules: string[] = content.match(ruleMatcher) ?? [];

  if (rules.length === 0) {
    throw new Error(
      'Docs checker is broken - it could not extract rules from docs index file.',
    );
  }

  return rules;
};

const hasCorrectAssertions = (documentPath, name) => {
  // eslint-disable-next-line node/no-sync
  const content = fs.readFileSync(documentPath, 'utf8');

  const match = /<!-- assertions ([A-Za-z]+) -->/u.exec(content);

  if (match === null) {
    return false;
  }

  return match[1] === name;
};

/**
 * Performed checks:
 *  - file `/.README/rules/<rule>.md` exists
 *  - file `/.README/rules/<rule>.md` contains correct assertions placeholder (`<!-- assertions ... -->`)
 *  - rule is included in gitdown directive in `/.README/README.md`
 *  - rules in `/.README/README.md` are alphabetically sorted
 */
const checkDocumentation = (rulesNames) => {
  const documentIndexRules = getDocumentIndexRules();

  const sorted = windows(documentIndexRules, 2).every((chunk) => {
    return chunk[0] && chunk[1] && chunk[0] < chunk[1];
  });

  if (!sorted) {
    throw new Error(
      'Rules are not alphabetically sorted in `.README/README.md` file.',
    );
  }

  const invalid = rulesNames.filter((names) => {
    const documentPath = path.resolve(
      __dirname,
      '../../.README/rules',
      names[1] + '.md',
    );
    const documentExists = isFile(documentPath);
    const inIndex = documentIndexRules.includes(names[1]);
    const hasAssertions = documentExists
      ? hasCorrectAssertions(documentPath, names[0])
      : false;

    return !(documentExists && inIndex && hasAssertions);
  });

  if (invalid.length > 0) {
    const invalidList = invalid
      .map((names) => {
        return names[0];
      })
      .join(', ');

    throw new Error(
      'Docs checker encountered an error in: ' +
        invalidList +
        '. ' +
        'Make sure that for every rule you created documentation file with assertions placeholder in camelCase ' +
        'and included the file path in `.README/README.md` file.',
    );
  }
};

checkDocumentation(getRules());
