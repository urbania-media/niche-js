/* eslint-disable no-param-reassign */
// const { createWebpackConfig } = require('@folklore/cli');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const getPackagesPaths = require('../scripts/build/getPackagesPaths');
const getPackagesAliases = require('../scripts/build/getPackagesAliases');

module.exports = {
    stories: getPackagesPaths()
        .filter((it) => it.match(/\/cli$/) === null)
        .map((packagePath) => path.join(packagePath, './src/**/*.stories.@(jsx|mdx)')),

    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-links',
        '@storybook/addon-interactions',
        {
            name: '@storybook/addon-styling',
            options: {
                postCss: true,
                cssModules: {
                    mode: 'local',
                    getLocalIdent: getCSSModuleLocalIdent,
                },
            },
        },
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    async babel(config, { configType }) {
        return {
            ...config,
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
        config.module.rules = [
            // {
            //     test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
            //     use: ['raw-loader'],
            // },
            // {
            //     test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
            //     use: [
            //         {
            //             loader: 'style-loader',
            //             options: {
            //                 injectType: 'singletonStyleTag',
            //                 attributes: {
            //                     'data-cke': true,
            //                 },
            //             },
            //         },
            //         'css-loader',
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 postcssOptions: styles.getPostCssConfig({
            //                     themeImporter: {
            //                         themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
            //                     },
            //                     minify: true,
            //                 }),
            //             },
            //         },
            //     ],
            // },
            ...config.module.rules,
        ];

        console.log(config.resolve.alias);
        return config;
    },
};
