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
];