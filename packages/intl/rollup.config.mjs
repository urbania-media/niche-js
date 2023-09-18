import replace from '@rollup/plugin-replace';

// For commonjs compat
import { createConfig } from '../../rollup.config.js';

const locales = ['fr', 'en'];

console.log('HELLO', locales, createConfig, createConfig);

const localesFiles = locales.reduce(
    (configs, locale) => [
        ...configs,
        createConfig({
            input: 'src/lang.js',
            output: `locale/${locale}.js`,
            prependPlugins: [
                replace({
                    values: {
                        REPLACE_LOCALE: locale,
                    },
                    delimiters: ['', ''],
                    preventAssignment: false,
                }),
            ],
        }),
        createConfig({
            input: 'src/lang.js',
            output: `locale/${locale}.cjs.js`,
            format: 'cjs',
            prependPlugins: [
                replace({
                    values: {
                        REPLACE_LOCALE: locale,
                    },
                    delimiters: ['', ''],
                    preventAssignment: false,
                }),
            ],
        }),
    ],
    [],
);

export default [
    createConfig({
        format: 'both',
    }),
    ...localesFiles,
];
