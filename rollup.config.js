import babel from "rollup-plugin-babel";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default [
  {
    input: "./src/index.tsx",
    output: [
      {
        file: "./dist/index.js",
        format: "cjs",
      },
      {
        file: "./dist/index.es.js",
        format: "es",
        exports: "named",
      },
    ],
    plugins: [
      json(),
      postcss({
        plugins: [],
        minimize: true,
      }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
      }),
      typescript(),
      external(),
      // resolve(),
      terser(),
      commonjs(),
      nodePolyfills(),
      nodeResolve({ preferBuiltins: false }),
    ],
  },
];
