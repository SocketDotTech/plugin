import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from "@rollup/plugin-typescript";
import autoprefixer from 'autoprefixer';

export default [
    {
        input: './src/index.tsx',
        output: [
            {
                file: './dist/index.js',
                format: 'cjs',
            },
            {
                file: './dist/index.es.js',
                format: 'es',
                exports: 'named',
            }
        ],
        plugins: [
            postcss({
                plugins: [],
                minimize: true,
            }),
            babel({
                exclude: 'node_modules/**',
                presets: ['@babel/preset-react']
            }),
            typescript(),
            external(),
            resolve(),
            terser()
        ]
    }
]