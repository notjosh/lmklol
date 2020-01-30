import builtins from 'builtin-modules';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: {
    dir: './dist',
    format: 'cjs',
  },

  external: builtins,

  plugins: [
    commonjs(),
    resolve({
      preferBuiltins: true,
    }),
    typescript({
      outDir: './dist',
    }),
  ],
};
