/* eslint-disable no-param-reassign */
import path from 'path';

import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { DefinePlugin } from 'webpack';

import getPackagesAliases from '../scripts/build/getPackagesAliases';
import getPackagesPaths from '../scripts/build/getPackagesPaths';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
    return path.dirname(require.resolve(path.join(value, 'package.json')));
}

export default {
    framework: getAbsolutePath('@storybook/react-webpack5'),

    stories: getPackagesPaths()
        .filter((it) => it.match(/\/cli$/) === null)
        .map((packagePath) => path.join(packagePath, './src/**/*.stories.@(jsx)')),

    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
        {
            name: getAbsolutePath('@storybook/addon-styling-webpack'),
            options: {
                rules: [
                    {
                        test: /\.css$/,
                        oneOf: [
                            {
                                test: /\.module\.css$/,
                                use: [
                                    'style-loader',
                                    {
                                        loader: 'css-loader',
                                        options: {
                                            importLoaders: 1,
                                            esModule: false,
                                            modules: {
                                                mode: 'local',
                                                getLocalIdent: getCSSModuleLocalIdent,
                                            },
                                        },
                                    },
                                    'postcss-loader',
                                ],
                            },
                            {
                                test: /\.css$/,
                                use: [
                                    'style-loader',
                                    {
                                        loader: 'css-loader',
                                        options: {
                                            importLoaders: 1,
                                            modules: {
                                                mode: 'icss',
                                            },
                                        },
                                    },
                                    'postcss-loader',
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    ],

    docs: {
        autodocs: true,
    },

    async babel(config, { configType }) {
        return {
            ...config,
            configFile: path.join(__dirname, '../babel.config.js'),
            babelrc: false,
            plugins: [
                [
                    require.resolve('babel-plugin-formatjs'),
                    {
                        idInterpolationPattern: '[sha512:contenthash:base64:6]',
                    },
                ],
            ],
        };
    },

    async webpackFinal(config, { configType }) {
        config.resolve = {
            ...config.resolve,
            alias: {
                ...config.resolve.alias,
                // '@folklore/routes': require.resolve('@folklore/routes'),
                // 'wouter': require.resolve('wouter'),
                // 'react-intl': require.resolve('react-intl'),
                // '@uppy/core/dist/style.css': require.resolve('@uppy/core/dist/style.css'),
                // '@uppy/core': require.resolve('@uppy/core'),
                // '@uppy/react': require.resolve('@uppy/react'),
                ...getPackagesAliases(),
            },
        };
        config.plugins = [
            new DefinePlugin({
                __EDITOR__: JSON.stringify(true),
            }),
            ...config.plugins,
        ];
        // console.log(config.resolve.alias);
        return config;
    },
};
