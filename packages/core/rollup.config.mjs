import alias from '@rollup/plugin-alias';
import path from 'path';

import { createConfig } from '../../rollup.config.mjs';

const files = {
    'index.js': {
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [new RegExp(path.join(process.cwd(), './src/lib'))],
        },
    },

    'utils.js': {
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [new RegExp(path.join(process.cwd(), './src/utils'))],
        },
    },

    'components.js': {
        prependPlugins: [
            alias({
                entries: [
                    {
                        find: /^(\.\.\/)*\.\.\/\.\.\/(contexts|utils|hooks)\/?$/,
                        replacement: '@niche-js/core/$2',
                    },
                    {
                        find: /(\.\.\/)*\.\.\/\.\.\/lib\/?$/,
                        replacement: '@niche-js/core',
                    },
                ],
            }),
        ],
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [
                new RegExp(path.join(process.cwd(), './src/components')),
                new RegExp(path.join(process.cwd(), './src/styles')),
            ],
        },
    },

    'contexts.js': {
        prependPlugins: [
            alias({
                entries: [
                    {
                        find: /\.\.\/(hooks|utils|contexts)\/?$/,
                        replacement: '@niche-js/core/$1',
                    },
                    {
                        find: /\.\.\/lib\/?$/,
                        replacement: '@niche-js/core',
                    },
                ],
            }),
        ],
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [
                new RegExp(path.join(process.cwd(), './src/components/namespaces')),
                new RegExp(path.join(process.cwd(), './src/contexts')),
                new RegExp(path.join(process.cwd(), './src/hooks/useUppyLocale')),
                new RegExp(
                    path.join(process.cwd(), './src/utils/getTransloaditMediasFromResponse'),
                ),
            ],
        },
    },

    'hooks.js': {
        prependPlugins: [
            alias({
                entries: [
                    {
                        find: /\.\.\/(contexts|utils)\/?$/,
                        replacement: '@niche-js/core/$1',
                    },
                    {
                        find: /\.\.\/lib\/?$/,
                        replacement: '@niche-js/core',
                    },
                ],
            }),
        ],
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [
                path.join(process.cwd(), './src/lib/EventsManager'),
                new RegExp(path.join(process.cwd(), './src/hooks')),
            ],
        },
    },
};

export default Object.keys(files).reduce(
    (configs, file) => [
        ...configs,
        createConfig({
            file,
            format: 'both',
            ...files[file],
        }),
    ],
    [],
);
