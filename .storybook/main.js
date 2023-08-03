import { dirname, join } from "path";
/* eslint-disable no-param-reassign */
// const { createWebpackConfig } = require('@folklore/cli');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const path = require('path');
const {
  styles
} = require('@ckeditor/ckeditor5-dev-utils');
const getPackagesPaths = require('../scripts/build/getPackagesPaths');
const getPackagesAliases = require('../scripts/build/getPackagesAliases');
module.exports = {
  stories: getPackagesPaths().filter(it => it.match(/\/cli$/) === null).map(packagePath => path.join(packagePath, './src/**/*.stories.@(jsx|mdx)')),
  addons: [getAbsolutePath("@storybook/addon-essentials"), getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-interactions"), {
    name: '@storybook/addon-styling',
    options: {
      cssBuildRule: {
        test: /\.css$/,
        oneOf: [{
          test: /\.module\.css$/,
          use: ['style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',
                getLocalIdent: getCSSModuleLocalIdent
              }
            }
          }, 'postcss-loader']
        }, {
          test: /\.css$/,
          use: ['style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'icss'
              }
            }
          }, 'postcss-loader']
        }]
      }
    }
  }],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  async babel(config, {
    configType
  }) {
    return {
      ...config,
      babelrc: false,
      plugins: [[require.resolve('babel-plugin-formatjs'), {
        idInterpolationPattern: '[sha512:contenthash:base64:6]'
      }]]
    };
  },
  async webpackFinal(config, {
    configType
  }) {
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
        ...getPackagesAliases()
      }
    };
    config.module.rules = [{
      oneOf: [{
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader']
      }, {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
        use: [{
          loader: 'style-loader',
          options: {
            injectType: 'singletonStyleTag',
            attributes: {
              'data-cke': true
            }
          }
        }, 'css-loader', {
          loader: 'postcss-loader',
          options: {
            postcssOptions: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
              },
              minify: true
            })
          }
        }]
      }, ...config.module.rules]
    }];
    // console.log(config.resolve.alias);
    return config;
  }
};
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}