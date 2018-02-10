import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';

const input = 'src/main.js';

export default [
  {
    input,
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.IS_UMD': JSON.stringify(true),
      }),
    ],
    output: [{ file: pkg.browser, format: 'umd', name: 'babeljs' }],
  },
  {
    input,
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.IS_UMD': JSON.stringify(false),
      }),
    ],
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
  },
];
