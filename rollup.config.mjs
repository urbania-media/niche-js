/* eslint-disable import/no-extraneous-dependencies */
import babelPluginRuntime from '@babel/plugin-transform-runtime';
import babelPresetEnv from '@babel/preset-env';
import babelPresetReact from '@babel/preset-react';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import babelPluginFormatJs from 'babel-plugin-formatjs';
import cssnano from 'cssnano';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import sass from 'sass';

import generateScopedName from './scripts/build/generateScopedName.mjs';
import imageAssets from './scripts/build/imageAssets.mjs';

export const createConfig = ({
    file = 'index.js',
    input = null,
    output = null,
    banner = null,
    footer = null,
    format = null,
    withoutPostCss = false,
    withoutPostCssExtract = false,
    withoutMinification = false,
    resolveOptions = null,
    prependPlugins = [],
    appendPlugins = [],
} = {}) => {
    const isNode = format === 'node';
    const isCjs = format === 'cjs' || format === 'node';
    const outputCjs = {
        file: output || `lib/${file}`,
        format: 'cjs',
        banner,
        footer,
        plugins: [withoutMinification ? null : terser()].filter((i) => i !== null),
    };
    const outputEs = {
        file: output || `es/${file}`,
        banner,
        footer,
        plugins: [withoutMinification ? null : terser()].filter((i) => i !== null),
    };

    let outputConfig;
    if (format === 'both') {
        outputConfig = [outputCjs, outputEs];
    } else {
        outputConfig = isCjs ? outputCjs : outputEs;
    }
    return {
        input: input || `src/${file}`,
        output: outputConfig,
        plugins: [
            ...prependPlugins,
            imageAssets({
                // limit: 0,
                include: [
                    'src/**/*.png',
                    'src/**/*.svg',
                    'src/**/*.jpg',
                    'src/**/*.gif',
                    'src/**/*.webp',
                ],
                emitFiles: true,
                // sourceDir: 'src/images',
                destDir: 'assets/images',
            }),
            json(),
            resolve({
                extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
                jail: path.join(process.cwd(), 'src'),
                ...resolveOptions,
            }),
            commonjs(),
            babel({
                extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
                exclude: 'node_modules/**',
                // rootMode: 'upward',
                babelHelpers: 'runtime',
                presets: [
                    [
                        babelPresetEnv,
                        isNode
                            ? {
                                  modules: false,
                                  useBuiltIns: false,
                                  targets: {
                                      node: '16',
                                  },
                              }
                            : {
                                  modules: false,
                                  useBuiltIns: false,
                              },
                    ],
                    [
                        babelPresetReact,
                        {
                            useBuiltIns: true,
                        },
                    ],
                ],
                plugins: [
                    babelPluginRuntime,
                    [
                        babelPluginFormatJs,
                        {
                            ast: true,
                            extractFromFormatMessageCall: true,
                            idInterpolationPattern: '[sha512:contenthash:base64:6]',
                        },
                    ],
                ],
            }),
            !withoutPostCss
                ? postcss({
                      preprocessor: (content, id) =>
                          new Promise((res) => {
                              const result = sass.compile({ file: id });
                              res({ code: result.css.toString() });
                          }),
                      extensions: ['.css', '.scss'],
                      modules: {
                          generateScopedName,
                      },
                      autoModules: true,
                      extract: !withoutPostCssExtract ? 'styles.css' : false,
                      inject: false,
                      plugins: [
                          cssnano({
                              preset: 'default',
                          }),
                      ],
                  })
                : false,
            // url({ include: ['**/*.mp4'] }),
            // url({ include: ['**/*.svg'], limit: 0, destDir: 'assets/img' }),
            // image({
            //     include: ['**/*.svg'],
            // }),
            replace({
                values: {
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                },
                preventAssignment: true,
            }),
            ...appendPlugins,
        ].filter(Boolean),
    };
};

export default [createConfig({ format: 'both' })];
