import recommended from './configs/recommended.json';
import destructuringPropertyNewline from './rules/destructuringPropertyNewline';
import exportSpecifierNewline from './rules/exportSpecifierNewline';
import filenameMatchExported from './rules/filenameMatchExported';
import filenameMatchRegex from './rules/filenameMatchRegex';
import filenameNoIndex from './rules/filenameNoIndex';
import idMatch from './rules/idMatch';
import importSpecifierNewline from './rules/importSpecifierNewline';
import noBarrelImport from './rules/noBarrelImport';
import noExportAll from './rules/noExportAll';
import noImportNamespaceDestructure from './rules/noImportNamespaceDestructure';
import noReExport from './rules/noReExport';
import noReassignImports from './rules/noReassignImports';
import noRestrictedImports from './rules/noRestrictedImports';
import noRestrictedStrings from './rules/noRestrictedStrings';
import noUseExtendNative from './rules/noUseExtendNative';
import preferImportAlias from './rules/preferImportAlias';
import preferInlineTypeImport from './rules/preferInlineTypeImport';
import preferReactLazy from './rules/preferReactLazy';
import preferUseMount from './rules/preferUseMount';
import requireExtension from './rules/requireExtension';
import sortReactDependencies from './rules/sortReactDependencies';

// Should be `ESLint.Plugin` but doesn't match with `createRule` results
const index: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  configs: any;
  rules: any;
  rulesConfig: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
} = {
  configs: {},
  rules: {
    'destructuring-property-newline': destructuringPropertyNewline,
    'export-specifier-newline': exportSpecifierNewline,
    'filename-match-exported': filenameMatchExported,
    'filename-match-regex': filenameMatchRegex,
    'filename-no-index': filenameNoIndex,
    'id-match': idMatch,
    'import-specifier-newline': importSpecifierNewline,
    'no-barrel-import': noBarrelImport,
    'no-export-all': noExportAll,
    'no-import-namespace-destructure': noImportNamespaceDestructure,
    'no-re-export': noReExport,
    'no-reassign-imports': noReassignImports,
    'no-restricted-imports': noRestrictedImports,
    'no-restricted-strings': noRestrictedStrings,
    'no-use-extend-native': noUseExtendNative,
    'prefer-import-alias': preferImportAlias,
    'prefer-inline-type-import': preferInlineTypeImport,
    'prefer-react-lazy': preferReactLazy,
    'prefer-use-mount': preferUseMount,
    'require-extension': requireExtension,
    'sort-react-dependencies': sortReactDependencies,
  },
  rulesConfig: {
    'destructuring-property-newline': 0,
    'export-specifier-newline': 0,
    'filename-match-exported': 0,
    'filename-match-regex': 0,
    'filename-no-index': 0,
    'id-match': 0,
    'import-specifier-newline': 0,
    'no-barrel-import': 0,
    'no-reassign-imports': 0,
    'no-restricted-imports': 0,
    'no-restricted-strings': 0,
    'no-use-extend-native': 0,
    'prefer-inline-type-import': 0,
    'prefer-react-lazy': 0,
    'prefer-use-mount': 0,
    'require-extension': 0
  },
};

const flatRecommended = JSON.parse(JSON.stringify(recommended));
flatRecommended.plugins = {
  canonical: index,
};
flatRecommended.languageOptions = {
  parserOptions: flatRecommended.parserOptions,
};
delete flatRecommended.parserOptions;

index.configs['flat/recommended'] = flatRecommended;
index.configs.recommended = recommended;

export = index;
