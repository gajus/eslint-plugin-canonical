import recommended from './configs/recommended.json';
import filenameMatchExported from './rules/filenameMatchExported';
import filenameMatchRegex from './rules/filenameMatchRegex';
import filenameNoIndex from './rules/filenameNoIndex';
import idMatch from './rules/idMatch';
import noRestrictedStrings from './rules/noRestrictedStrings';
import sortKeys from './rules/sortKeys';

export default {
  configs: {
    recommended,
  },
  rules: {
    'filename-match-exported': filenameMatchExported,
    'filename-match-regex': filenameMatchRegex,
    'filename-no-index': filenameNoIndex,
    'id-match': idMatch,
    'no-restricted-strings': noRestrictedStrings,
    'sort-keys': sortKeys,
  },
  rulesConfig: {
    'filename-match-exported': 0,
    'filename-match-regex': 0,
    'filename-no-index': 0,
    'id-match': 0,
    'no-restricted-strings': 0,
    'sort-keys': 0,
  },
};
