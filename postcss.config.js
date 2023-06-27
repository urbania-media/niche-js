const presetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');

module.exports = {
    plugins: [presetEnv({}), postcssImport({})],
};
