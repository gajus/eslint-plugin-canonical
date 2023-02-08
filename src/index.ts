import recommended from './configs/recommended.json';
import destructuringPropertyNewline from './rules/destructuringPropertyNewline';
import exportSpecifierNewline from './rules/exportSpecifierNewline';
import filenameMatchExported from './rules/filenameMatchExported';
import filenameMatchRegex from './rules/filenameMatchRegex';
import filenameNoIndex from './rules/filenameNoIndex';
import idMatch from './rules/idMatch';
import importSpecifierNewline from './rules/importSpecifierNewline';
import noRestrictedStrings from './rules/noRestrictedStrings';
import noUnusedExports from './rules/noUnusedExports';
import noUseExtendNative from './rules/noUseExtendNative';
import preferImportAlias from './rules/preferImportAlias';
import preferInlineTypeImport from './rules/preferInlineTypeImport';
import preferUseMount from './rules/preferUseMount';
import sortKeys from './rules/sortKeys';
import virtualModule from './rules/virtualModule';

export = {
  configs: {
    recommended,
  },
  rules: {
    'destructuring-property-newline': destructuringPropertyNewline,
    'export-specifier-newline': exportSpecifierNewline,
    'filename-match-exported': filenameMatchExported,
    'filename-match-regex': filenameMatchRegex,
    'filename-no-index': filenameNoIndex,
    'id-match': idMatch,
    'import-specifier-newline': importSpecifierNewline,
    'no-restricted-strings': noRestrictedStrings,
    'no-unused-exports': noUnusedExports,
    'no-use-extend-native': noUseExtendNative,
    'prefer-import-alias': preferImportAlias,
    'prefer-inline-type-import': preferInlineTypeImport,
    'prefer-use-mount': preferUseMount,
    'sort-keys': sortKeys,
    'virtual-module': virtualModule,
  },
  rulesConfig: {
    'destructuring-property-newline': 0,
    'export-specifier-newline': 0,
    'filename-match-exported': 0,
    'filename-match-regex': 0,
    'filename-no-index': 0,
    'id-match': 0,
    'import-specifier-newline': 0,
    'no-restricted-strings': 0,
    'no-use-extend-native': 0,
    'prefer-inline-type-import': 0,
    'prefer-use-mount': 0,
    'sort-keys': 0,
  },
};
