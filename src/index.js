import recommended from './configs/recommended.json';
import exportSpecifierNewline from './rules/exportSpecifierNewline';
import filenameMatchExported from './rules/filenameMatchExported';
import filenameMatchRegex from './rules/filenameMatchRegex';
import filenameNoIndex from './rules/filenameNoIndex';
import idMatch from './rules/idMatch';
import importSpecifierNewline from './rules/importSpecifierNewline';
import noRestrictedStrings from './rules/noRestrictedStrings';
import noUseExtendNative from './rules/noUseExtendNative';
import sortKeys from './rules/sortKeys';

export default {
  configs: {
    recommended,
  },
  rules: {
    'export-specifier-newline': exportSpecifierNewline,
    'filename-match-exported': filenameMatchExported,
    'filename-match-regex': filenameMatchRegex,
    'filename-no-index': filenameNoIndex,
    'id-match': idMatch,
    'import-specifier-newline': importSpecifierNewline,
    'no-restricted-strings': noRestrictedStrings,
    'no-use-extend-native': noUseExtendNative,
    'sort-keys': sortKeys,
  },
  rulesConfig: {
    'export-specifier-newline': 0,
    'filename-match-exported': 0,
    'filename-match-regex': 0,
    'filename-no-index': 0,
    'id-match': 0,
    'import-specifier-newline': 0,
    'no-restricted-strings': 0,
    'no-use-extend-native': 0,
    'sort-keys': 0,
  },
};
