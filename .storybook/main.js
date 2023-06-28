/* eslint-disable no-param-reassign */
// const { createWebpackConfig } = require('@folklore/cli');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const path = require('path');
const getPackagesPaths = require('../scripts/build/getPackagesPaths');

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
};
