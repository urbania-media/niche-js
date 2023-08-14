/* eslint-disable import/no-extraneous-dependencies */
import babelPluginRuntime from '@babel/plugin-transform-runtime';
import babelPresetEnv from '@babel/preset-env';
import babelPresetReact from '@babel/preset-react';
// import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import babelPluginFormatJs from 'babel-plugin-formatjs';
// import fs from 'fs';
import path from 'path';
import postcss from 'rollup-plugin-postcss';

import getPackage from './scripts/build/getPackage';
import getPackages from './scripts/build/getPackages';

import generateScopedName from './scripts/build/generateScopedName.mjs';
import imageAssets from './scripts/build/imageAssets.mjs';

export const createConfig = ({
    file = 'index.js',
    input = null,
    output: outputFile = null,
    outputCjs: outputCjsFile = null,
    outputEs: outputEsFile = null,
    banner = null,
    footer = null,
    format = null,
    isEditor = false,
    withoutPostCss = false,
    withoutPostCssExtract = false,
    withoutMinification = true,
    resolveOptions = null,
    prependPlugins = [],
    appendPlugins = [],
    replaceValues = null,
} = {}) => {
    const isNode = format === 'node';
    const isCjs = format === 'cjs' || format === 'node';
    const outputCjs = {
        file: outputCjsFile || outputFile || `lib/${file}`,
        format: 'cjs',
        banner,
        footer,
        plugins: [withoutMinification ? null : terser()].filter((i) => i !== null),
    };
    const outputEs = {
        file: outputEsFile || outputFile || `es/${file}`,
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
        treeshake: {
            moduleSideEffects: (id, external) => id.match(/\.(css|scss)$/) !== null,
            manualPureFunctions: ['useIsEditor'],
        },
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
            resolve({
                resolveOnly: ['@panneau/core', '@panneau/core/contexts'],
            }),
            commonjs({}),
            babel({
                extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
                exclude: 'node_modules/**',
                rootMode: 'upward',
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
                      extensions: ['.css'],
                      modules: {
                          generateScopedName,
                      },
                      autoModules: true,
                      extract: !withoutPostCssExtract ? 'styles.css' : false,
                      inject: false,
                  })
                : false,
            // url({ include: ['**/*.mp4'] }),
            // url({ include: ['**/*.svg'], limit: 0, destDir: 'assets/img' }),
            // image({
            //     include: ['**/*.svg'],
            // }),
            replace({
                values: {
                    __EDITOR__: JSON.stringify(isEditor),
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    ...replaceValues,
                },
                preventAssignment: true,
            }),
            !isEditor &&
                replace({
                    values: {
                        isEditor: JSON.stringify(false),
                    },
                    preventAssignment: true,
                }),
            ...appendPlugins,
        ].filter(Boolean),
    };
};

const {
    name: currentPackageName,
    isEditor,
    hasEditor,
    exports: currentPackageExports,
} = getPackage(process.cwd());

const editorReplaceValues = getPackages()
    .filter(
        ({ name, hasEditor: packageHasEditor }) => name !== currentPackageName && packageHasEditor,
    )
    .reduce(
        (map, { name: packageName, exports: packageExports = [] }) => ({
            ...map,
            [packageName]: JSON.stringify(`${packageName}/editor`),
            ...packageExports.reduce(
                (subMap, exportName) => ({
                    ...subMap,
                    [`${packageName}/${exportName}`]: JSON.stringify(
                        `${packageName}/editor/${exportName}`,
                    ),
                }),
                {},
            ),
        }),
        {},
    );

const editorReplacePlugin = replace({
    values: {
        ...editorReplaceValues,
    },
    delimiters: ["'", "'"],
    preventAssignment: true,
});

export default [
    createConfig({
        format: 'both',
        isEditor,
        appendPlugins: [
            isEditor && editorReplacePlugin,
            // resolve({
            //     resolveOnly: [/@niche-js\/core/],
            // }),
        ].filter(Boolean),
    }),
    ...currentPackageExports.map((packageExport) =>
        createConfig({
            file: `${packageExport}.js`,
            format: 'both',
            isEditor,
            appendPlugins: [
                isEditor && editorReplacePlugin,
                // resolve({
                //     resolveOnly: [/@niche-js\/core/]
                // }),
            ].filter(Boolean),
        }),
    ),
    ...(hasEditor
        ? [
              createConfig({
                  format: 'both',
                  outputCjs: 'lib/editor.js',
                  outputEs: 'es/editor.js',
                  isEditor: true,
                  prependPlugins: [editorReplacePlugin],
              }),
              ...currentPackageExports.map((packageExport) =>
                  createConfig({
                      file: `${packageExport}.js`,
                      format: 'both',
                      outputCjs: `lib/editor/${packageExport}.js`,
                      outputEs: `es/editor/${packageExport}.js`,
                      isEditor: true,
                      prependPlugins: [editorReplacePlugin],
                  }),
              ),
          ]
        : []),
].filter(Boolean);
