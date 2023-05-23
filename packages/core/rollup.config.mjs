import alias from '@rollup/plugin-alias';
import path from 'path';

import { createConfig } from '../../rollup.config.mjs';

const files = {
    'index.js': {
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [new RegExp(path.join(__dirname, './src/lib'))],
        },
    },

    'utils.js': {
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [new RegExp(path.join(__dirname, './src/utils'))],
        },
    },

    'components.js': {
        prependPlugins: [
            alias({
                entries: [
                    {
                        find: /^(\.\.\/)*\.\.\/\.\.\/(contexts|utils|hooks)\/?$/,
                        replacement: '@niche/core/$2',
                    },
                    {
                        find: /(\.\.\/)*\.\.\/\.\.\/lib\/?$/,
                        replacement: '@niche/core',
                    },
                ],
            }),
        ],
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [
                new RegExp(path.join(__dirname, './src/components')),
                new RegExp(path.join(__dirname, './src/styles')),
            ],
        },
    },

    'contexts.js': {
        prependPlugins: [
            alias({
                entries: [
                    {
                        find: /\.\.\/(hooks|utils|contexts)\/?$/,
                        replacement: '@niche/core/$1',
                    },
                    {
                        find: /\.\.\/lib\/?$/,
                        replacement: '@niche/core',
                    },
                ],
            }),
        ],
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [
                new RegExp(path.join(__dirname, './src/components/namespaces')),
                new RegExp(path.join(__dirname, './src/contexts')),
                new RegExp(path.join(__dirname, './src/hooks/useUppyLocale')),
                new RegExp(path.join(__dirname, './src/utils/getTransloaditMediasFromResponse')),
            ],
        },
    },

    'hooks.js': {
        prependPlugins: [
            alias({
                entries: [
                    {
                        find: /\.\.\/(contexts|utils)\/?$/,
                        replacement: '@niche/core/$1',
                    },
                    {
                        find: /\.\.\/lib\/?$/,
                        replacement: '@niche/core',
                    },
                ],
            }),
        ],
        resolveOptions: {
            extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
            resolveOnly: [
                path.join(__dirname, './src/lib/EventsManager'),
                new RegExp(path.join(__dirname, './src/hooks')),
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
