var typescript = require('@rollup/plugin-typescript');
var json = require('@rollup/plugin-json');

module.exports = [
  {
    input: './src/index.ts',
    output: [{ file: 'dist/index.js', format: 'cjs' }],
    plugins: [
      typescript(),
      json(),
    ],
  }
];
