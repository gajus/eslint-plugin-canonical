// import auto from 'eslint-config-canonical/configurations/auto.js';
import eslintPluginCanonical from './dist/src/index.js';

export default [
  {
    ignores: [
      'package-lock.json',
      '**/ExportMap.ts',
      'tests/fixtures',

      'coverage',
      'dist',
      'node_modules',
      'pnpm-lock.yaml',
      '*.log',
      '.*',
      '!.github',
      '!.gitignore',
      '!.husky',
      '!.releaserc',
    ],
  },
  eslintPluginCanonical.configs['flat/recommended'],
  // ...auto,
];

/*
  'overrides': [
    {
      'extends': [
        'canonical',
        'canonical/node',
        'canonical/typescript',
        'canonical/typescript-disable-type-checking',
        'canonical/prettier'
      ],
      'rules': {
        'unicorn/expiring-todo-comments': 0,
        '@typescript-eslint/no-for-in-array': 0
      },
      'files': '*.ts'
    },
    {
      'extends': [
        'canonical/json'
      ],
      files: ['*.json']
    }
  ]
*/
