import builtins from 'builtin-modules';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: {
    dir: './dist',
    format: 'cjs',
  },

  external: [...builtins, 'readable-stream'],

  plugins: [
    commonjs(),
    json({
      compact: true,
      preferConst: true,
    }),
    resolve({
      preferBuiltins: true,
    }),
    typescript({
      outDir: './dist',
    }),
  ],

  onwarn(warning, rollupWarn) {
    const ignoredCircular = ['luxon'];
    if (
      warning.code === 'CIRCULAR_DEPENDENCY' &&
      ignoredCircular.some(d => warning.importer.includes(d))
    ) {
      return;
    }
    rollupWarn(warning);
  },
};
