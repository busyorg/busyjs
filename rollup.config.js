import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
import builtins from 'rollup-plugin-node-builtins';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
  {
    input: 'src/main.js',
    output: {
      name: 'busy',
      file: pkg.browser,
      format: 'iife',
    },
    plugins: [resolve(), commonjs(), uglify({}, minify), builtins(), json(), filesize()],
  },
  {
    input: 'src/main.js',
    output: [{ file: pkg.main, format: 'cjs' }],
  },
];
